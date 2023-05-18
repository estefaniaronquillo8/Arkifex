const {
  createCost,
  getAllCosts,
  updateCost,
  deleteCost,
  findById,
} = require("../repositories/costRepository");

exports.getCosts = async (req, res) => {
  const response = await getAllCosts();
  return res.status(response.status).json(response);
};

exports.edit = async (req, res) => {
  const response = await findById(req.params.id);
  return res.status(response.status).json(response);
};

exports.update = async (req, res) => {
  const response = await updateCost(req.params.id, req.body);
  return res.status(response.status).json(response);
};

exports.create = async (req, res) => {
  const response = await createCost(req.body);
  return res.status(response.status).json(response);
};

exports.delete = async (req, res) => {
  const response = await deleteCost(req.params.id);
  return res.status(response.status).json(response);
};
