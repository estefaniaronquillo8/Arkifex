const {
  createResourceAssignment,
  updateResourceAssignment,
  deleteAssignment,
  getAllAsignments,
  findAssignmentByResourceProject,
  findAssignmentByProject,
  findById,
} = require("../repositories/resourceAssignmentRepository.js");


exports.getAllAsignments = async (req, res) => {
  const response = await getAllAsignments();
  return res.status(response.status).json(response);
};

exports.findAssignmentByProject = async (req, res) => {
  const response = await findAssignmentByProject(req.params.projectId);
  return res.status(response.status).json(response);
};

exports.editAssigments = async (req, res) => {
  const response = await findById(req.params.id);
  return res.status(response.status).json(response);
};

exports.updateResourceAssignment = async (req, res) => {
  const response = await updateResourceAssignment(req.params.id, req.body);
  return res.status(response.status).json(response);
};

exports.createResourceAssignment = async (req, res) => {
  const response = await createResourceAssignment(req.body);
  return res.status(response.status).json(response);
};

exports.deleteAssignment = async (req, res) => {
  const response = await deleteAssignment(req.params.id);
  return res.status(response.status).json(response);
};
