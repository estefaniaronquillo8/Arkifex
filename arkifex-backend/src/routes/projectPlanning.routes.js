const express = require('express');
const router = express.Router();
const { costController, projectPlanningController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/projectspl', isAuthenticated, projectPlanningController.getProjectsPlanning);
router.post('/projectspl/create', isAuthenticated,  projectPlanningController.create);
router.get('/projectspl/edit/:id', isAuthenticated,  projectPlanningController.edit);
router.put('/projectspl/edit/:id', isAuthenticated,  projectPlanningController.update);
router.delete("/projectspl/delete/:id", isAuthenticated,  projectPlanningController.delete);

module.exports = router;