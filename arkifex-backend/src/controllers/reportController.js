const {
    createReport,
    getBudgetByProjectPlanningReport
  } = require("../repositories/reportRepository");
  
  exports.createReport = async (req, res) => {
    const response = await createReport(req.params.id);
    return res.status(response.status).json(response);
  };

  exports.getReport = async (req, res) => {
    const response = await getBudgetByProjectPlanningReport(req.params.id);
    return res.status(response.status).json(response);
  };
  