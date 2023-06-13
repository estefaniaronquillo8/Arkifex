const locationController = require('../controllers/locationController');
const projectController = require('../controllers/projectController');
const reportController = require('../controllers/reportController');
const resourceController = require('../controllers/resourceController');
const resourceAssignmentController = require('../controllers/resourceAssignmentController');
const roleController = require('../controllers/roleController');
const userController = require('../controllers/userController');
const versionController = require('../controllers/versionController');
const projectPlanningController = require('../controllers/projectPlanningController');

module.exports = {
    locationController,
    projectController,
    reportController,
    resourceAssignmentController,
    resourceController,
    roleController,
    userController,
    versionController,
    projectPlanningController
}