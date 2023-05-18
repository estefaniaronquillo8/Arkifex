const express = require('express');
const baseRouter = express.Router();

const userRoutes = require('./user.routes');
const costRoutes = require('./cost.routes');
const resourceRoutes = require('./resource.routes');

baseRouter.use(userRoutes, costRoutes, resourceRoutes);
// baseRouter.use();
// baseRouter.use();

module.exports = baseRouter;