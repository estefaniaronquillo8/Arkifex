const {
  createProject,
  getAllProjects,
  updateProject,
  deleteProject,

  createTemplate,
  getAllTemplates,
  duplicateProject,
  duplicateSubproject,

  findById,
} = require("../repositories/projectRepository");

exports.getProjects = async (req, res) => {
  const response = await getAllProjects();
  return res.status(response.status).json(response);
};

exports.edit = async (req, res) => {
  const response = await findById(req.params.id);
  return res.status(response.status).json(response);
};

exports.update = async (req, res) => {
  const response = await updateProject(req.params.id, req.body);
  return res.status(response.status).json(response);
};

exports.create = async (req, res) => {
  const response = await createProject(req.body);
  return res.status(response.status).json(response);
};

exports.delete = async (req, res) => {
  const response = await deleteProject(req.params.id);
  return res.status(response.status).json(response);
};

exports.createTemp = async (req, res) => {
  const response = await createTemplate(req.body);
  return res.status(response.status).json(response);
};

exports.getTemplates = async (req, res) => {
  const response = await getAllTemplates();
  return res.status(response.status).json(response);
};

exports.duplicate = async (req, res) => {
  const response = await duplicateProject(req.params.id);
  return res.status(response.status).json(response);
};

exports.duplicateSubpry = async (req, res) => {
  const parentId = req.body.parentId; // Extraemos el parentId del cuerpo de la petición
  const response = await duplicateSubproject(req.params.id, parentId); // Pasamos el parentId como un segundo argumento a la función
  return res.status(response.status).json(response);
};