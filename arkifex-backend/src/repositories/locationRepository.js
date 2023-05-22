const { Location, sequelize } = require("../models");

const createLocation = async (locationData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findLocationByAddress(locationData.address);
    if (response?.location) {
      return {
        status: 409,
        message: "Location already exists",
        notificationType: "info",
      };
    }
    const location = await Location.create(locationData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      location: location,
      message: "Location created successfully!",
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

const getAllLocations = async () => {
  try {
    const locations = await Location.findAll();
    if (locations?.length === 0) {
      return {
        status: 200,
        locations: locations,
        message: "Actualmente no existen lugares",
        notificationType: "info",
      };
    }
    return { status: 200, locations: locations };
  } catch (error) {
    return {
      status: 500,
      locations: [],
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const updateLocation = async (id, locationData) => {
  const transaction = await sequelize.transaction();
  try {
    if (locationData.address) {
      const response = await findLocationByAddress(locationData.address);
      if (response.status === 200 && response.location.id !== parseInt(id)) {
        return {
          status: 409,
          message: "Address already exists",
          notificationType: "info",
        };
      }
    }
    await Location.update(locationData, { where: { id }, transaction });
    await transaction.commit();
    const updatedLocation = await findById(id);
    return {
      status: 200,
      message: "Location updated successfully",
      user: updatedLocation.location,
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

const deleteLocation = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await Location.destroy({ where: { id }, transaction });
    await transaction.commit();
    return {
      status: 200,
      message: "Location deleted successfully!",
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

const findLocationByAddress = async (address) => {
  const location = await Location.findOne({ where: { address } });
  if (!location) {
    return { status: 404 };
  }
  return { status: 200, location };
};

const findById = async (id) => {
  const location = await Location.findByPk(id);

  if (!location) {
    return {
      status: 404,
      message: "Registro no encontrado.",
      notificationType: "info",
    };
  }
  return {
    status: 200,
    location: location,
    message: "Información de los lugares recuperada con éxito.",
    notificationType: "success",
  };
};

module.exports = {
  createLocation,
  getAllLocations,
  updateLocation,
  deleteLocation,
  findLocationByAddress,
  findById,
};
