const { Project, sequelize } = require("../models");

const createProject = async (ProjectData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findProjectByName(ProjectData.name);
    if (response?.Project) {
      return {
        status: 409,
        message: "Project already exists",
        notificationType: "info",
      };
    }
    const Project = await Project.create(ProjectData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      Project: Project,
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
    const Projects = await Project.findAll();

    if (Projects?.length === 0) {
      return {
        status: 200,
        Projects: Projects,
        message: "Actualmente no existen proyectos",
        notificationType: "info",
      };
    }
    return { status: 200, Projects: Projects };
  } catch (error) {
    return {
      status: 500,
      Projects: [],
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const updateProject = async (id, ProjectData) => {
  const transaction = await sequelize.transaction();
  try {
    if (ProjectData.name) {
      const response = await findProjectByName(ProjectData.name);
      if (response.status === 200 && response.Project.id !== parseInt(id)) {
        return {
          status: 409,
          message: "name already exists",
          notificationType: "info",
        };
      }
    }
    await Project.update(ProjectData, { where: { id }, transaction });
    await transaction.commit();
    const updatedProject = await findById(id);
    return {
      status: 200,
      message: "Project updated successfully",
      user: updatedProject.Project,
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
  const Project = await Project.findOne({ where: { name } });
  if (!Project) {
    return { status: 404 };
  }
  return { status: 200, Project };
};

const findById = async (id) => {
  const Project = await Project.findByPk(id);

  if (!Project) {
    return {
      status: 404,
      message: "Registro no encontrado.",
      notificationType: "info",
    };
  }
  return {
    status: 200,
    Project: Project,
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
