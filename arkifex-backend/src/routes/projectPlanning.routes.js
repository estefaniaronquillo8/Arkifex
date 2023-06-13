const express = require('express');
const router = express.Router();
const { projectPlanningController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/projectPlannings', isAuthenticated, projectPlanningController.getProjectPlannings);
router.post('/projectPlannings/create', isAuthenticated, projectPlanningController.create);
router.get('/projectPlannings/edit/:id', isAuthenticated, projectPlanningController.edit);
router.put('/projectPlannings/edit/:id', isAuthenticated, projectPlanningController.update);
router.delete("/projectPlannings/delete/:id", isAuthenticated, projectPlanningController.delete);

module.exports = router;