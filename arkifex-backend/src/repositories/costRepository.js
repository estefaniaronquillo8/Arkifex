const { Cost, sequelize } = require("../models");

const createCost = async (costData) => {
  const transaction = await sequelize.transaction();
  try {
    const response = await findCostByDescription(costData.description);
    if (response?.cost) {
      return {
        status: 409,
        message: "Cost already exists",
        notificationType: "info",
      };
    }
    const cost = await Cost.create(costData, { transaction });
    await transaction.commit();
    return {
      status: 200,
      cost: cost,
      message: "Cost created successfully!",
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

const getAllCosts = async () => {
  try {
    const costs = await Cost.findAll();

    if (costs?.length === 0) {
      return {
        status: 200,
        costs: costs,
        message: "Actualmente no existen costos",
        notificationType: "info",
      };
    }
    return { status: 200, costs: costs };
  } catch (error) {
    return {
      status: 500,
      costs: [],
      message: "Internal server error",
      notificationType: "error",
    };
  }
};

const updateCost = async (id, costData) => {
  const transaction = await sequelize.transaction();
  try {
    if (costData.description) {
      const response = await findCostByDescription(costData.description);
      if (response.status === 200 && response.cost.id !== parseInt(id)) {
        return {
          status: 409,
          message: "Description already exists",
          notificationType: "info",
        };
      }
    }
    await Cost.update(costData, { where: { id }, transaction });
    await transaction.commit();
    const updatedCost = await findById(id);
    return {
      status: 200,
      message: "Cost updated successfully",
      user: updatedCost.cost,
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

const deleteCost = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await Cost.destroy({ where: { id }, transaction });
    await transaction.commit();
    return {
      status: 200,
      message: "Cost deleted successfully!",
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

const findCostByDescription = async (description) => {
  const cost = await Cost.findOne({ where: { description } });
  if (!cost) {
    return { status: 404 };
  }
  return { status: 200, cost };
};

const findById = async (id) => {
  const cost = await Cost.findByPk(id);

  if (!cost) {
    return {
      status: 404,
      message: "Registro no encontrado.",
      notificationType: "info",
    };
  }
  return {
    status: 200,
    cost: cost,
    message: "Información del costo recuperada con éxito.",
    notificationType: "success",
  };
};

module.exports = {
  createCost,
  getAllCosts,
  updateCost,
  deleteCost,
  findCostByDescription,
  findById,
};
