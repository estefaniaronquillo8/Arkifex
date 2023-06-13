const { Resource, sequelize } = require("../models");

const createResource = async (resourceData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findResourceByName(resourceData.name);
    if (response?.resource) {
      return {
        status: 409,
        message: "Resource already exists",
        notificationType: "info",
      };
    }
    const resource = await Resource.create(resourceData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      resource: resource,
      message: "Resource created successfully!",
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

const getAllResources = async () => {
  try {
    const resources = await Resource.findAll();

    if (resources?.length === 0) {
      return {
        status: 200,
        resources: resources,
        message: "Actualmente no existen recursos",
        notificationType: "info",
      };
    }
    return { status: 200, resources: resources };
  } catch (error) {
    return {
      status: 500,
      resources: [],
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const updateResource = async (id, resourceData) => {
  const transaction = await sequelize.transaction();
  try {
    if (resourceData.name) {
      const response = await findResourceByName(resourceData.name);
      if (response.status === 200 && response.resource.id !== parseInt(id)) {
        return {
          status: 409,
          message: "Name already exists",
          notificationType: "info",
        };
      }
    }
    await Resource.update(resourceData, { where: { id }, transaction });
    await transaction.commit();
    const updatedResource = await findById(id);
    return {
      status: 200,
      message: "Resource updated successfully",
      user: updatedResource.resource,
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

const deleteResource = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await Resource.destroy({ where: { id }, transaction });
    await transaction.commit();
    return {
      status: 200,
      message: "Resource deleted successfully!",
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

const findResourceByName = async (name) => {
  const resource = await Resource.findOne({ where: { name } });
  if (!resource) {
    return { status: 404 };
  }
  return { status: 200, resource };
};

const findById = async (id) => {
  const resource = await Resource.findByPk(id);

  if (!resource) {
    return {
      status: 404,
      message: "Registro no encontrado.",
      notificationType: "info",
    };
  }
  return {
    status: 200,
    resource: resource,
    message: "Información del recurso recuperada con éxito.",
    notificationType: "success",
  };
};

module.exports = {
  createResource,
  getAllResources,
  updateResource,
  deleteResource,
  findResourceByName,
  findById,
};
