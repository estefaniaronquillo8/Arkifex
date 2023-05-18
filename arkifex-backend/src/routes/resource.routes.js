const express = require('express');
const router = express.Router();
const { resourceController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/resources', isAuthenticated, resourceController.getResources);
router.post('/resources/create', isAuthenticated, resourceController.create);
router.get('/resources/edit/:id', isAuthenticated, resourceController.edit);
router.put('/resources/edit/:id', isAuthenticated, resourceController.update);
router.delete("/resources/delete/:id", isAuthenticated, resourceController.delete);

module.exports = router;