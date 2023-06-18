const {
    createReport
  } = require("../repositories/reportRepository");
  
  exports.getReports = async (req, res) => {
    const response = await createReport(req.params.id);
    return res.status(response.status).json(response);

  };
  