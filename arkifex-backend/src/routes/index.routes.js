const express = require("express");
const baseRouter = express.Router();

const userRoutes = require("./user.routes");
const resourceRoutes = require("./resource.routes");
const projectPlanningRoutes = require("./projectPlanning.routes");
const projectRoutes = require("./project.routes");
const locationRoutes = require("./location.routes");
const resourceAssignmentRoutes = require("./resourceAssignment.routes");

baseRouter.use(
  userRoutes,
  resourceRoutes,
  projectPlanningRoutes,
  projectRoutes,
  locationRoutes,
  resourceAssignmentRoutes
);

module.exports = baseRouter;
