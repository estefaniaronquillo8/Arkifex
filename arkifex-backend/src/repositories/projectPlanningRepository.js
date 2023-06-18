const { ProjectPlanning, sequelize } = require("../models");

const createProjectPlanning = async (projectPlanningData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findProjectPlanningByName(projectPlanningData.name);
    if (response?.projectPlanning) {
      return {
        status: 409,
        message: "ProjectPlanning already exists",
        notificationType: "info",
      };
    }
    const projectPlanning = await ProjectPlanning.create(projectPlanningData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      projectPlanning: projectPlanning,
      message: "ProjectPlanning created successfully!",
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

const getAllProjectPlannings = async () => {
  try {
    const projectPlannings = await ProjectPlanning.findAll();

    if (projectPlannings?.length === 0) {
      return {
        status: 200,
        projectPlannings: projectPlannings,
        message: "Actualmente no existen recursos",
        notificationType: "info",
      };
    }
    return { status: 200, projectPlannings: projectPlannings };
  } catch (error) {
    return {
      status: 500,
      projectPlannings: [],
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const getAllProjectPlanningsByProject = async (projectId) => {
  try {
    const projectPlannings = await ProjectPlanning.findAll({Where:{projectId: projectId }});

    if (projectPlannings?.length === 0) {
      return {
        status: 200,
        projectPlannings: projectPlannings,
        message: "Actualmente no existen recursos",
        notificationType: "info",
      };
    }
    return { status: 200, projectPlannings: projectPlannings };
  } catch (error) {
    return {
      status: 500,
      projectPlannings: [],
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const updateProjectPlanning = async (id, projectPlanningData) => {
  const transaction = await sequelize.transaction();
  try {
    if (projectPlanningData.name) {
      const response = await findProjectPlanningByName(projectPlanningData.name);
      if (response.status === 200 && response.projectPlanning.id !== parseInt(id)) {
        return {
          status: 409,
          message: "Name already exists",
          notificationType: "info",
        };
      }
    }
    await ProjectPlanning.update(projectPlanningData, { where: { id }, transaction });
    await transaction.commit();
    const updatedProjectPlanning = await findById(id);
    return {
      status: 200,
      message: "projectPlanning updated successfully",
      user: updatedProjectPlanning.projectPlanning,
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

const deleteProjectPlanning = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await ProjectPlanning.destroy({ where: { id }, transaction });
    await transaction.commit();
    return {
      status: 200,
      message: "ProjectPlanning deleted successfully!",
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

const findProjectPlanningByName = async (name) => {
  const projectPlanning = await ProjectPlanning.findOne({ where: { name } });
  if (!projectPlanning) {
    return { status: 404 };
  }
  return { status: 200, projectPlanning };
};

const findById = async (id) => {
  const projectPlanning = await ProjectPlanning.findByPk(id);

  if (!projectPlanning) {
    return {
      status: 404,
      message: "Registro no encontrado.",
      notificationType: "info",
    };
  }
  return {
    status: 200,
    projectPlanning: projectPlanning,
    message: "Información del projectPlanning recuperada con éxito.",
    notificationType: "success",
  };
};

module.exports = {
  createProjectPlanning,
  getAllProjectPlannings,
  getAllProjectPlanningsByProject,
  updateProjectPlanning,
  deleteProjectPlanning,
  findProjectPlanningByName,
  findById,
};
