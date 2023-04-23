const { Cost, sequelize } = require("../models");

const createCost = async (costData) => {
  const transaction = await sequelize.transaction();
  try {
    const foundCost = await findCostByResource(costData.resourceId);
    if (foundCost) {
      return {
        status: 409,
        message: "Ya existe un costo asociado a este recurso.",
      };
    }
    const cost = await Cost.create(costData, { transaction });
    await transaction.commit();
    return { status: 200, cost: cost, message: "Cost created successfully!" };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Internal server error" };
  }
};

const getAllCosts = async () => {
  const costs = await Cost.findAll();

  if (costs?.length === 0) {
    return { status: 404, message: "No existe ningún costo." };
  }

  return { status: 200, costs: costs };
};

const updateCost = async (id, costData) => {
  const transaction = await sequelize.transaction();
  try {
    if (costData.resourceId) {
      const foundCost = await findCostByResource(costData.resourceId);
      if (foundCost.id !== parseInt(id)) {
        return { status: 409, message: "Cost already exists" };
      }
    }
    await Cost.update(costData, { where: { id }, transaction });
    await transaction.commit();
    const updatedCost = await findById(id);
    updatedCost.message = "Costo actualizado con éxito.";
    return updateCost;
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Internal server error" };
  }
};

const deleteCost = async (id) => {
  const transaction = await sequelize.transaction();
  try {
    await Cost.destroy({ where: { id }, transaction });
    await transaction.commit();
    return { status: 200, message: "Cost deleted successfully!" };
  } catch (error) {
    await transaction.rollback();
    return { status: 500, message: "Internal server error" };
  }
};

const findCostByResource = async (resourceId) => {
  return await Cost.findOne({ where: { resourceId } });
};

const findById = async (id) => {
  const cost = await Cost.findByPk(id);

  if (!cost) {
    return { status: 404, message: "Registro no encontrado." };
  }

  return {
    status: 200,
    cost: cost,
    message: "Información de costo recuperada con éxito.",
  };
};

module.exports = {
  createCost,
  getAllCosts,
  updateCost,
  deleteCost,
  findCostByResource,
  findById,
};
