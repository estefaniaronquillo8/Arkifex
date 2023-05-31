const { ResourceAssignment, sequelize } = require("../models");

const createResourceAssignment = async (resourceAssignmentData) => {
  const transaction = await sequelize.transaction();
  try {
    const responseProject = await findResourceAssignmentByProject(resourceAssignmentData.projectId);
    const responseResource = await findResourceAssignmentByResource(resourceAssignmentData.resourceId);
    if (responseProject?.resourceAssignmentProject) {
      if (responseResource?.resourceAssignmentResource) {
        return {
          status: 409,
          message: "ResourceAssignment already exists in this project",
          notificationType: "info",
        };
      }
    }
    const resourceAssignment = await ResourceAssignment.create(
      resourceAssignmentData,
      { transaction }
    );
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

const updateResourceAssignment = async (id, resourceAssignmentData) => {
  const transaction = await sequelize.transaction();
  try {
    if (resourceAssignmentData.projectId) {
      const response = await findResourceAssignmentByProject(resourceAssignmentData.projectId);
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
    await ResourceAssignment.update(resourceAssignmentData, {
      where: { id },
      transaction,
    });
    await transaction.commit();
    const updatedResourceAssignment = await findById(id);
    return {
      status: 200,
      message: "ResourceAssignment updated successfully",
      user: updatedResourceAssignment.resourceAssignment,
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

const findResourceAssignmentByProject = async (projectId) => {
  const resourceAssignmentProject = await ResourceAssignment.findOne({
    where: { projectId },
  });
  if (!resourceAssignmentProject) {
    return { status: 404 };
  }
  return { status: 200, resourceAssignmentProject };
};

const findResourceAssignmentByResource = async (resourceId) => {
  const resourceAssignmentResource = await ResourceAssignment.findOne({
    where: { resourceId },
  });
  if (!resourceAssignmentResource) {
    return { status: 404 };
  }
  return { status: 200, resourceAssignmentResource };
};

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

module.exports = {
  createResourceAssignment,
  getAllResourceAssignments,
  updateResourceAssignment,
  deleteResourceAssignment,
  findResourceAssignmentByProject,
  findById,
};
