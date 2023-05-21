const { Project, sequelize } = require("../models");

const createProject = async (projectData) => {
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
    const project = await Project.create(projectData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      Project: project,
      message: "Project created successfully!",
      notificationType: "success",
    };
  } catch (error) {
    await transaction.rollback();
    console.log(error)
    return {
      status: 500,
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const getAllProjects = async () => {
  try {
    const projects = await Project.findAll();

    if (projects?.length === 0) {
      return {
        status: 200,
        Projects: projects,
        message: "Actualmente no existen proyectos",
        notificationType: "info",
      };
    }
    return { status: 200, projects: projects };
  } catch (error) {
    return {
      status: 500,
      Projects: [],
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
      user: updatedProject.project,
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
    await Project.destroy({ where: { id }, transaction });
    await transaction.commit();
    return {
      status: 200,
      message: "Project deleted successfully!",
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

const findProjectByName = async (name) => {
  const project = await Project.findOne({ where: { name } });
  if (!project) {
    return { status: 404 };
  }
  return { status: 200, project };
};

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
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,
  findProjectByName,
  findById,
};
