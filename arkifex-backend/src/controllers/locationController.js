const {
  createLocation,
  getAllLocations,
  updateLocation,
  deleteLocation,
  findById,
} = require("../repositories/locationRepository");

exports.getLocations = async (req, res) => {
  const response = await getAllLocations();
  return res.status(response.status).json(response);
};

exports.edit = async (req, res) => {
  const response = await findById(req.params.id);
  return res.status(response.status).json(response);
};

exports.update = async (req, res) => {
  const response = await updateLocation(req.params.id, req.body);
  return res.status(response.status).json(response);
};

exports.create = async (req, res) => {
  const response = await createLocation(req.body);
  return res.status(response.status).json(response);
};

exports.delete = async (req, res) => {
  const response = await deleteLocation(req.params.id);
  return res.status(response.status).json(response);
};
