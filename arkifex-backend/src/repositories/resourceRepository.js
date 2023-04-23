const { Resource, sequelize } = require("../models");

const createResource = async (resourceData) => {
  console.log(resourceData);
  const transaction = await sequelize.transaction();
  try {
    const foundResource = await findResourceByName(resourceData.name);
    console.log(foundResource);
    if (foundResource) {
      return { status: 409, message: "Resource already exists" };
    }
    const resource = await Resource.create(resourceData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      resource: resource,
      message: "Resource created successfully!",
    };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Internal server error" };
  }
};

const getAllResources = async () => {
  const resources = await Resource.findAll();

  if (resources?.length === 0) {
    return { status: 404, message: "No existe ningún recurso." };
  }

  return { status: 200, resources: resources };
};

const updateResource = async (id, resourceData) => {
  const transaction = await sequelize.transaction();
  try {
    if (resourceData.name) {
      const foundResource = await findResourceByName(resourceData.name);
      if (foundResource.id !== parseInt(id)) {
        return { status: 409, message: "Name already exists" };
      }
    }
    await Resource.update(resourceData, { where: { id }, transaction });
    await transaction.commit();
    const updatedResource = await findById(id);
    updatedCost.message = "Recurso actualizado con éxito.";
    return updatedResource;
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Internal server error" };
  }
};

const deleteResource = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await Resource.destroy({ where: { id }, transaction });
    await transaction.commit();
    return { status: 200, message: "Resource deleted successfully!" };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Internal server error" };
  }
};

const findResourceByName = async (name) => {
  return await Resource.findOne({ where: { name } });
};

const findById = async (id) => {
  const resource = await Resource.findByPk(id);

  if (!resource) {
    return { status: 404, message: "Registro no encontrado." };
  }
  return {
    status: 200,
    resource: resource,
    message: "Información del recurso recuperada con éxito.",
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
