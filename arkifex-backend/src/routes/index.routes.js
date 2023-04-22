const express = require('express');
const baseRouter = express.Router();

const userRoutes = require('./user.routes');

baseRouter.use(userRoutes);

module.exports = baseRouter;