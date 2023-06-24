const express = require('express');
const router = express.Router();
const { projectController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/templates', isAuthenticated, projectController.getTemplates);
router.post('/templates/create', isAuthenticated, projectController.createTemp);
router.post('/templates/duplicate/:id', isAuthenticated, projectController.duplicate);

module.exports = router;