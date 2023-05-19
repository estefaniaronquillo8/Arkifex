const {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
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
  