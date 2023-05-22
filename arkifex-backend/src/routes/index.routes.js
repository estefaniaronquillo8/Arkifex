const express = require("express");
const baseRouter = express.Router();

const userRoutes = require("./user.routes");
const costRoutes = require("./cost.routes");
const resourceRoutes = require("./resource.routes");
const projectRoutes = require("./project.routes");
const projectPlanningRoutes = require("./projectPlanning.routes");
const locationRoutes = require("./location.routes");
const resourceAssignmentRoutes = require("./resourceAssignment.routes");

baseRouter.use(
  userRoutes,
  costRoutes,
  resourceRoutes,
  projectRoutes,
  projectPlanningRoutes,
  locationRoutes,
  resourceAssignmentRoutes
);

module.exports = baseRouter;
