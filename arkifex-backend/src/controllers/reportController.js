const {
    createReport,
    getLastReport,
    getReports
  } = require("../repositories/reportRepository");
  
  exports.createReport = async (req, res) => {
    const response = await createReport(req.params.id);
    return res.status(response.status).json(response);
  };

  exports.getReportByDate = async (req, res) => {
    const response = await getLastReport(req.params.id);
    return res.status(response.status).json(response);
  };

  exports.getAllReports = async (req, res) => {
    const response = await getReports(req.params.id);
    return res.status(response.status).json(response);
  };
  