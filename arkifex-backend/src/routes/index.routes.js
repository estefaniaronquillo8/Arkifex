const express = require('express');
const baseRouter = express.Router();

const userRoutes = require('./user.routes');
const costRoutes = require('./cost.routes');
const resourceRoutes = require('./resource.routes');
const locationRoutes = require('./location.routes');
const assignmentRoutes = require('./resourceAssignment.routes');


baseRouter.use(userRoutes, costRoutes, resourceRoutes,locationRoutes, assignmentRoutes);
// baseRouter.use();
// baseRouter.use();

module.exports = baseRouter;