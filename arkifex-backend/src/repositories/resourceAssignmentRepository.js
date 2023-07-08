const { ResourceAssignment, sequelize } = require("../models");

const createResourceAssignment = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findResourceAssignmentByProjectPlanningIdAndResourceId(data.projectPlanningId, data.resourceId);
    if (response?.resourceAssignment) {
        return {
          status: 409,
          message: "ResourceAssignment already exists in this project Planning",
          notificationType: "info",
        };
    }
    const resourceAssignment = await ResourceAssignment.create(data, { transaction });
    await transaction.commit();
    return {
      status: 200,
      resourceAssignment: resourceAssignment,
      message: "ResourceAssignment created successfully!",
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

const getAllResourceAssignments = async () => {
  try {
    const resourceAssignments = await ResourceAssignment.findAll();
    if (resourceAssignments?.length === 0) {
      return {
        status: 200,
        resourceAssignments: resourceAssignments,
        message: "Actualmente no existen resourceAssignments",
        notificationType: "info",
      };
    }
    return { status: 200, resourceAssignments: resourceAssignments };
  } catch (error) {
    return {
      status: 500,
      resourceAssignments: [],
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const updateResourceAssignment = async (id, data) => {
  const transaction = await sequelize.transaction();
  try {
    if (data.projectPlanningId && data.resourceId) {
      const response = await findResourceAssignmentByProjectPlanningIdAndResourceId(data.projectPlanningId, data.resourceId);
      if (
        response.status === 200 &&
        response.resourceAssignment.id !== parseInt(id)
      ) {
        return {
          status: 409,
          message: "Address already exists",
          notificationType: "info",
        };
      }
    }
    await ResourceAssignment.update(data, {
      where: { id },
      transaction,
    });
    await transaction.commit();
    const updatedResourceAssignment = await findById(id);
    return {
      status: 200,
      message: "ResourceAssignment updated successfully",
      resourceAssignment: updatedResourceAssignment.resourceAssignment,
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

const deleteResourceAssignment = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await ResourceAssignment.destroy({ where: { id }, transaction });
    await transaction.commit();
    return {
      status: 200,
      message: "ResourceAssignment deleted successfully!",
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

const findResourceAssignmentByProjectPlanningIdAndResourceId = async (projectPlanningId, resourceId) => {
  const resourceAssignment = await ResourceAssignment.findOne({ where: { projectPlanningId, resourceId }});
  if (!resourceAssignment){
    return { status: 404 };
  }
  return { status: 200, resourceAssignment };
}

const findById = async (id) => {
  const resourceAssignment = await ResourceAssignment.findByPk(id);

  if (!resourceAssignment) {
    return {
      status: 404,
      message: "Registro no encontrado.",
      notificationType: "info",
    };
  }
  return {
    status: 200,
    resourceAssignment: resourceAssignment,
    message: "Información de los lugares recuperada con éxito.",
    notificationType: "success",
  };
};

const getAllResourceAssignmentsByProjectPlanningId = async (projectPlanningId) => {
  try {
    const resourceAssignments = await ResourceAssignment.findAll({ where: { projectPlanningId }});
    
    return { status: 200, resourceAssignments: resourceAssignments };
  } catch (error) {
    return {
      status: 500,
      resourceAssignments: [],
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

module.exports = {
  createResourceAssignment,
  getAllResourceAssignments,
  updateResourceAssignment,
  deleteResourceAssignment,
  findResourceAssignmentByProjectPlanningIdAndResourceId,
  findById,
  getAllResourceAssignmentsByProjectPlanningId,
};
