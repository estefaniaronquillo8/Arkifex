const {
  createLocation,
  updateLocation,
  deleteLocation,
  getAllLocations,
  findLocationByProject,
  findLocation,
  findById,
} = require("../repositories/locationRepository.js");

exports.getLocations = async (req, res) => {
  const response = await getAllLocations();
  return res.status(response.status).json(response);
};

exports.findLocationsByProject = async (req,res) => {
    const response = await findLocationByProject(req.params.projectId)
    return res.status(response.status).json(response);
}

exports.editLocations = async (req, res) => {
  const response = await findById(req.params.id);
  return res.status(response.status).json(response);
};

exports.updateLocation = async (req, res) => {
  const response = await updateLocation(req.params.id, req.body);
  return res.status(response.status).json(response);
};

exports.createLocation = async (req, res) => {
  const response = await createLocation(req.body);
  return res.status(response.status).json(response);
};

exports.deleteLocation = async (req, res) => {
  const response = await deleteLocation(req.params.id);
  return res.status(response.status).json(response);
};
