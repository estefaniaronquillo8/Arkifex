const express = require('express');
const baseRouter = express.Router();

const userRoutes = require('./user.routes');
const costRoutes = require('./cost.routes');
const resourceRoutes = require('./resource.routes');

baseRouter.use(userRoutes);
baseRouter.use(costRoutes);
baseRouter.use(resourceRoutes);

module.exports = baseRouter;