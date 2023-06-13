const { Version, sequelize } = require("../models");

const findVersionByProjectAndDate = async (projectId,versionDate) => {
    const version = await Version.findOne({ where: { id: projectId, versionDate: versionDate} });
    if (!version) {
      return { status: 404 };
    }
    return { status: 200, version };
  };

const createVersion = async (versionData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findVersionByProjectAndDate(versionData.projectId, versionData.versionDate);
    if (response?.Version) {
      return {
        status: 409,
        message: "Version already exists",
        notificationType: "info",
      };
    }
    const Version = await Version.create(versionData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      Version: Version,
      message: "Version created successfully!",
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

const getAllVersionsByProjectId = async (projectId) => {
  try {
    const versions = await Version.findAll({ where: { id: projectId} });
    if (versions?.length === 0) {
      return {
        status: 200,
        versions: versions,
        message: "Actualmente no existen versiones",
        notificationType: "info",
      };
    }
    return { status: 200, versions: versions };
  } catch (error) {
    return {
      status: 500,
      versions: [],
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const updateVersion = async (id, versionData) => {
  const transaction = await sequelize.transaction();
  try {
    if (versionData.address) {
      const response = await findVersionByProjectAndDate(id, versionData.versionDate);
      if (response.status === 200 && response.Version.id !== parseInt(id)) {
        return {
          status: 409,
          message: "Address already exists",
          notificationType: "info",
        };
      }
    }
    await Version.update(versionData, { where: { id }, transaction });
    await transaction.commit();
    const updatedVersion = await findById(id);
    return {
      status: 200,
      message: "Version updated successfully",
      user: updatedVersion.Version,
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

const deleteVersion = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await Version.destroy({ where: { id }, transaction });
    await transaction.commit();
    return {
      status: 200,
      message: "Version deleted successfully!",
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



const findById = async (id) => {
  const Version = await Version.findByPk(id);

  if (!Version) {
    return {
      status: 404,
      message: "Registro no encontrado.",
      notificationType: "info",
    };
  }
  return {
    status: 200,
    Version: Version,
    message: "Información de los lugares recuperada con éxito.",
    notificationType: "success",
  };
};

module.exports = {
  createVersion,
  getAllVersionsByProjectId,
  updateVersion,
  deleteVersion,
  findVersionByProjectAndDate,
  findById,
};
