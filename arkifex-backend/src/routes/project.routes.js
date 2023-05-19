const express = require('express');
const router = express.Router();
const { projectController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/projects', isAuthenticated, projectController.getProjects);
router.post('/projects/create', isAuthenticated, projectController.create);
router.get('/projects/edit/:id', isAuthenticated, projectController.edit);
router.put('/projects/edit/:id', isAuthenticated, projectController.update);
router.delete("/projects/delete/:id", isAuthenticated, projectController.delete);

module.exports = router;