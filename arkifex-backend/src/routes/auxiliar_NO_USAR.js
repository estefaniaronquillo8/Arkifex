const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authentication');
const {
    costController,
    initialPlanningController,
    locationController,
    projectController,
    reportController,
    resourceAssignmentController,
    resourceController,
    userController
} = require('../controllers/index');


// Costs
/* router.get('/costs', isAuthenticated, costController.getUsers);
router.get('/costs/edit/:id', isAuthenticated, costController.edit);
router.put('/costs/edit/:id', isAuthenticated, costController.update);
router.delete("/costs/delete/:id", isAuthenticated, costController.delete);

// Initial Planning
router.get('/initial-plannings', isAuthenticated, initialPlanningController.getUsers);
router.get('/initial-plannings/edit/:id', isAuthenticated, initialPlanningController.edit);
router.put('/initial-plannings/edit/:id', isAuthenticated, initialPlanningController.update);
router.delete("/initial-plannings/delete/:id", isAuthenticated, initialPlanningController.delete);

// Location
router.get('/locations', isAuthenticated, locationController.getUsers);
router.get('/locations/edit/:id', isAuthenticated, locationController.edit);
router.put('/locations/edit/:id', isAuthenticated, locationController.update);
router.delete("/locations/delete/:id", isAuthenticated, locationController.delete);
 */
// Project
router.get('/projects', isAuthenticated, projectController.getProjects);
router.get('/projects/edit/:id', isAuthenticated, projectController.edit);
router.put('/projects/edit/:id', isAuthenticated, projectController.update);
router.delete("/projects/delete/:id", isAuthenticated, projectController.delete);

/* // Report
router.get('/reports', isAuthenticated, reportController.getUsers);
router.get('/reports/edit/:id', isAuthenticated, reportController.edit);
router.put('/reports/edit/:id', isAuthenticated, reportController.update);
router.delete("/reports/delete/:id", isAuthenticated, reportController.delete);

// Resource
router.get('/resources', isAuthenticated, resourceController.getUsers);
router.get('/resources/edit/:id', isAuthenticated, resourceController.edit);
router.put('/resources/edit/:id', isAuthenticated, resourceController.update);
router.delete("/resources/delete/:id", isAuthenticated, resourceController.delete);

// Resource Assignment
router.get('/resource-assignments', isAuthenticated, resourceAssignmentController.getUsers);
router.get('/resource-assignments/edit/:id', isAuthenticated, resourceAssignmentController.edit);
router.put('/resource-assignments/edit/:id', isAuthenticated, resourceAssignmentController.update);
router.delete("/resource-assignments/delete/:id", isAuthenticated, resourceAssignmentController.delete);
 */
module.exports = router;
