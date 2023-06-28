const express = require("express");
const baseRouter = express.Router();

const userRoutes = require("./user.routes");
const resourceRoutes = require("./resource.routes");
const projectPlanningRoutes = require("./projectPlanning.routes");
const projectRoutes = require("./project.routes");
const templateRoutes = require("./template.routes");
const locationRoutes = require("./location.routes");
const resourceAssignmentRoutes = require("./resourceAssignment.routes");
const versionRoutes = require("./version.routes");
const reportRoutes = require("./report.routes");

baseRouter.use(
  userRoutes,
  resourceRoutes,
  projectPlanningRoutes,
  projectRoutes,
  templateRoutes,
  locationRoutes,
  resourceAssignmentRoutes,
  versionRoutes,
  reportRoutes
);

module.exports = baseRouter;
