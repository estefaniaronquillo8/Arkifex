const {
    createProjectPlanning,
    getAllProjectPlannings,
    updateProjectPlanning,
    deleteProjectPlanning,
    findById,
  } = require("../repositories/projectPlanningRepository");
  
  exports.getProjectPlannings = async (req, res) => {
    const response = await getAllProjectPlannings();
    return res.status(response.status).json(response);
  };
  
  exports.edit = async (req, res) => {
    const response = await findById(req.params.id);
    return res.status(response.status).json(response);
  };
  
  exports.update = async (req, res) => {
    const response = await updateProjectPlanning(req.params.id, req.body);
    return res.status(response.status).json(response);
  };
  
  exports.create = async (req, res) => {
    const response = await createProjectPlanning(req.body);
    return res.status(response.status).json(response);
  };
  
  exports.delete = async (req, res) => {
    const response = await deleteProjectPlanning(req.params.id);
    return res.status(response.status).json(response);
  };
  