const {
  Project,
  ProjectPlanning,
  ResourceAssignment,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

// PROJECTS
const createProject = async (projectData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findProjectByName(projectData.name);
    const responseSubpry = await findProjectByParentId(projectData.name);
    if (response?.project) {
      if (responseSubpry?.project) {
        return {
          status: 409,
          message: "Subproject already exists",
          notificationType: "info",
        };
      }
      return {
        status: 409,
        message: "Project already exists",
        notificationType: "info",
      };
    }
    const project = await Project.create(projectData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      project: project,
      message: "Project created successfully!",
      notificationType: "success",
    };
  } catch (error) {
    await transaction.rollback();
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const getAllProjects = async () => {
  try {
    const projects = await Project.findAll({
      where: { status: { [Op.ne]: "Template" } },
    });

    if (projects?.length === 0) {
      return {
        status: 200,
        projects: projects,
        message: "Actualmente no existen proyectos",
        notificationType: "info",
      };
    }
    return { status: 200, projects: projects };
  } catch (error) {
    return {
      status: 500,
      projects: [],
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const updateProject = async (id, projectData) => {
  const transaction = await sequelize.transaction();
  try {
    if (projectData.name) {
      const response = await findProjectByName(projectData.name);
      if (response.status === 200 && response.project.id !== parseInt(id)) {
        return {
          status: 409,
          message: "name already exists",
          notificationType: "info",
        };
      }
    }
    await Project.update(projectData, { where: { id }, transaction });
    await transaction.commit();
    const updatedProject = await findById(id);
    return {
      status: 200,
      message: "Project updated successfully",
      project: updatedProject.project,
      notificationType: "success",
    };
  } catch (error) {
    await transaction.rollback();
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const deleteProject = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    console.log("IDDDDD EN LA FUNCION DE DELETEPROJECT BACK", id)

    // Añade la validación para subproyectos
    const subProjects = await Project.findAll({ where: { parentId: id } });
    if (subProjects && subProjects.length > 0) {
      return {
        status: 400,
        message: "No se puede eliminar el proyecto porque tiene subproyectos asociados. Por favor, elimine los subproyectos primero.",
        notificationType: "info",
      };
    }

    await Project.destroy({ where: { id }, transaction });
    await transaction.commit();
    return {
      status: 200,
      message: "Project deleted successfully!",
      notificationType: "success",
    };
  } catch (error) {
    console.log("EEEERRRRRRRROOOOOORRRRRRRRRR", error);
    await transaction.rollback();
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};


// TEMPLATES
const createTemplate = async (projectData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findProjectByName(projectData.name);
    if (response?.project) {
      return {
        status: 409,
        message: "Project already exists",
        notificationType: "info",
      };
    }

    // Define que el proyecto es una plantilla
    projectData.isTemplate = true;
    projectData.status = "Template";
    projectData.startDate = new Date("2023-01-01");
    projectData.endDate = new Date("2024-01-01");

    const project = await Project.create(projectData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      project: project,
      message: "Template created successfully!",
      notificationType: "success",
    };
  } catch (error) {
    await transaction.rollback();
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const getAllTemplates = async () => {
  try {
    const templates = await Project.findAll({ where: { isTemplate: true } });

    if (templates?.length === 0) {
      return {
        status: 200,
        projects: templates,
        message: "Actualmente no existen plantillas",
        notificationType: "info",
      };
    }
    return { status: 200, projects: templates };
  } catch (error) {
    return {
      status: 500,
      projects: [],
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

async function duplicateProject(projectId) {
  try {
    // Encuentra el proyecto original
    const originalProject = await Project.findOne({ where: { id: projectId } });
    // Duplica el proyecto excluyendo el id
    let { id, ...projectData } = originalProject.get({ plain: true }); // Excluye el id 
    const newProject = await Project.create({
      ...projectData,
      status: "Comenzando",
      isTemplate: false,
      name: `${originalProject.name}_duplicate`,
    });

    // Encuentra y duplica los datos de ProjectPlannings
    const originalProjectPlannings = await ProjectPlanning.findAndCountAll({
      where: { projectId },
    });
    for (const opp of originalProjectPlannings.rows) {
      // Excluye id y projectId al crear el nuevo ProjectPlanning
      let { id, projectId, ...planningData } = opp.get({ plain: true });
      const newProjectPlanning = await ProjectPlanning.create({
        ...planningData,
        projectId: newProject.id,
      });

      // Encuentra y duplica los datos de ResourceAssignments para cada ProjectPlanning
      const originalResourceAssignments =
        await ResourceAssignment.findAndCountAll({
          where: { projectPlanningId: opp.id },
        });
      for (const ora of originalResourceAssignments.rows) {
        // Excluye id y projectPlanningId al crear el nuevo ResourceAssignment
        let { id, projectPlanningId, ...assignmentData } = ora.get({
          plain: true,
        });
        await ResourceAssignment.create({
          ...assignmentData,
          projectPlanningId: newProjectPlanning.id,
        });
      }
    }
    return {
      status: 200,
      project: newProject,
      message: "Proyecto duplicado con éxito",
      notificationType: "success",
    };
  } catch (error) {
    await transaction.rollback();
    return {
      status: 500,
      message: "Error interno del servidor",
      notificationType: "error",
    };
  }
}

async function duplicateSubproject(projectId, parentId) {
  try {
    console.log("PARENT ID EN EL DUPLICATE SUBPROJECT", parentId)
    // Encuentra el proyecto original
    const originalProject = await Project.findOne({ where: { id: projectId } });
    // Duplica el proyecto excluyendo el id
    let { id, ...projectData } = originalProject.get({ plain: true }); // Excluye el id 
    const newProject = await Project.create({
      ...projectData,
      status: "Comenzando",
      parentId: parentId,
      isTemplate: false,
      name: `${originalProject.name}_duplicate`,
    });

    // Encuentra y duplica los datos de ProjectPlannings
    const originalProjectPlannings = await ProjectPlanning.findAndCountAll({
      where: { projectId },
    });
    for (const opp of originalProjectPlannings.rows) {
      // Excluye id y projectId al crear el nuevo ProjectPlanning
      let { id, projectId, ...planningData } = opp.get({ plain: true });
      const newProjectPlanning = await ProjectPlanning.create({
        ...planningData,
        projectId: newProject.id,
      });

      // Encuentra y duplica los datos de ResourceAssignments para cada ProjectPlanning
      const originalResourceAssignments =
        await ResourceAssignment.findAndCountAll({
          where: { projectPlanningId: opp.id },
        });
      for (const ora of originalResourceAssignments.rows) {
        // Excluye id y projectPlanningId al crear el nuevo ResourceAssignment
        let { id, projectPlanningId, ...assignmentData } = ora.get({
          plain: true,
        });
        await ResourceAssignment.create({
          ...assignmentData,
          projectPlanningId: newProjectPlanning.id,
        });
      }
    }
    return {
      status: 200,
      project: newProject,
      message: "Proyecto duplicado con éxito",
      notificationType: "success",
    };
  } catch (error) {
    await transaction.rollback();
    return {
      status: 500,
      message: "Error interno del servidor",
      notificationType: "error",
    };
  }
}

const findProjectByName = async (name) => {
  const project = await Project.findOne({ where: { name, parentId: null } });
  if (!project) {
    return { status: 404 };
  }
  return { status: 200, project };
};

const findProjectByParentId = async (name) => {
  const project = await Project.findOne({ where: { name, parentId: { [Op.ne]: null } } });
  if (!project) {
    return { status: 404 };
  }
  return { status: 200, project };
};

/* const findProjectByNameAndParentId = async (name) => {
  const project = await Project.findOne({ where: { name } });
  if (!project) {
    return { status: 404 };
  } 
  return { status: 200, project };
}; */

const findById = async (id) => {
  const project = await Project.findByPk(id);

  if (!project) {
    return {
      status: 404,
      message: "Registro no encontrado.",
      notificationType: "info",
    };
  }
  return {
    status: 200,
    project: project,
    message: "Información del proyecto recuperada con éxito.",
    notificationType: "success",
  };
};

module.exports = {
  // Projects
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,

  //Templates
  createTemplate,
  getAllTemplates,
  duplicateProject,
  duplicateSubproject,

  findProjectByName,
  findById,
};
