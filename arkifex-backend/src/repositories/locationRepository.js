const { Location, sequelize } = require("../models");
// const { Sequelize, Transaction } = require('sequelize');

const createLocation = async (locationData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findLocationByProject(locationData.projecId);
    if (response.location) {
      return { status: 409, message: "Ya existe una ubicacion con ese nombre." };
    }
    const location = await Location.create(locationData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      location: location,
      message: "¡Ubicacion creada exitosamente!",
    };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Error interno del servidor." };
  }
};

const updateLocation = async (id, locationData) => {
  const transaction = await sequelize.transaction();
  try {
    if (locationData.projecId) {
      const response = await findLocationByProject(locationData.projecId);
      if (response.status === 200 && response.location.id !== parseInt(id)) {
        return {
          status: 409,
          message: "Ya existe una ubicacion con ese nombre.",
        };
      }
    }
    await Location.update(locationData, { where: { id }, transaction });
    await transaction.commit();
    const updatedLocation = await findById(id);
    return {
      status: 200,
      message: "!Ubicacion actualizado exitosamente!",
      location: updatedLocation.location,
    };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Error interno del servidor." };
  }
};

const deleteLocation = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await Location.destroy({ where: { id }, transaction });
    await transaction.commit();
    return { status: 200, message: "¡Ubicacion eliminado exitosamente!" };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Error interno del servidor." };
  }
};

const getAllLocations = async () => {
    const locations = await Location.findAll();
  
    if (!locations || locations.length === 0) {
      return { status: 404, message: "No existen registros." };
    }
  
    return { status: 200, locations: locations };
  };
  
  const findLocationByProject = async (projecId) => {
    const location = await Location.findOne({ where: { projecId: projecId } });
    if (!location) {
      return { status: 404, message: 'Ubicacion no encontrada.' };
    }
    return { status: 200, project };
  };
  
  const findLocation = async (where) => {
    const location = await Location.findOne(where);
    if (!location) {
      return { status: 404, message: "Ubicacion no encontrado." };
    }
  
    return { status: 200, project: project };
  };
  
  const findById = async (id) => {
    const location = await Location.findByPk(id);
  
    if (!location) {
      return { status: 404, message: "Ubicacion no encontrado." };
    }
  
    return { status: 200, location: location };
  };

module.exports = {
  createLocation,
  updateLocation,
  deleteLocation,
  getAllLocations,
  findLocationByProject,
  findLocation,
  findById,
};
