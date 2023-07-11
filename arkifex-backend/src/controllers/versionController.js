const {
    createVersion,
    getAllVersionsByProjectId,
    updateVersion,
    deleteVersion,
    findVersionByProjectAndDate,
    findById
  } = require("../repositories/versionRepository");
  
  exports.getVersions = async (req, res) => {
    const response = await getAllVersionsByProjectId(req.params.id);
    return res.status(response.status).json(response);
  };
  
  exports.edit = async (req, res) => {
    const response = await findById(req.params.id);
    return res.status(response.status).json(response);
  };
  
  exports.update = async (req, res) => {
    const response = await updateVersion(req.params.id, req.body);
    return res.status(response.status).json(response);
  };
  
  exports.create = async (req, res) => {
    const response = await createVersion(req.body);
    return res.status(response.status).json(response);
  };
  
  exports.delete = async (req, res) => {
    const response = await deleteVersion(req.params.id);
    return res.status(response.status).json(response);
  };
  