const costController = require('../controllers/costController');
const projectPlanningController = require('../controllers/projectPlanningController');
const locationController = require('../controllers/locationController');
const projectController = require('../controllers/projectController');
const reportController = require('../controllers/reportController');
const resourceController = require('../controllers/resourceController');
const resourceAssignmentController = require('../controllers/resourceAssignmentController');
const roleController = require('../controllers/roleController');
const userController = require('../controllers/userController');

module.exports = {
    costController,
    projectPlanningController,
    locationController,
    projectController,
    reportController,
    resourceAssignmentController,
    resourceController,
    roleController,
    userController
}