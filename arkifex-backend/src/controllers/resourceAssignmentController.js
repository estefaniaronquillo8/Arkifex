const {
  createResourceAssignment,
  getAllResourceAssignments,
  updateResourceAssignment,
  deleteResourceAssignment,
  findById,
} = require("../repositories/resourceAssignmentRepository");

exports.getResourceAssignments = async (req, res) => {
  const response = await getAllResourceAssignments();
  return res.status(response.status).json(response);
};

exports.edit = async (req, res) => {
  const response = await findById(req.params.id);
  return res.status(response.status).json(response);
};

exports.update = async (req, res) => {
  const response = await updateResourceAssignment(req.params.id, req.body);
  return res.status(response.status).json(response);
};

exports.create = async (req, res) => {
  const response = await createResourceAssignment(req.body);
  return res.status(response.status).json(response);
};

exports.delete = async (req, res) => {
  const response = await deleteResourceAssignment(req.params.id);
  return res.status(response.status).json(response);
};
