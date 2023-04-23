const {
  createResource,
  getAllResources,
  updateResource,
  deleteResource,
  findById,
} = require("../repositories/resourceRepository");

exports.getResources = async (req, res) => {
  const response = await getAllResources();
  return res.status(response.status).json(response);
};

exports.edit = async (req, res) => {
  const response = await findById(req.params.id);
  return res.status(response.status).json(response);
};

exports.update = async (req, res) => {
  const response = await updateResource(req.params.id, req.body);
  return res.status(response.status).json(response);
};

exports.create = async (req, res) => {
  const response = await createResource(req.body);
  return res.status(response.status).json(response);
};

exports.delete = async (req, res) => {
  const response = await deleteResource(req.params.id);
  return res.status(response.status).json(response);
};
