const express = require('express');
const router = express.Router();
const { resourceAssignmentController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/resourceAssignments', isAuthenticated, resourceAssignmentController.getResourceAssignments);
router.post('/resourceAssignments/create', isAuthenticated,  resourceAssignmentController.create);
router.get('/resourceAssignments/edit/:id', isAuthenticated,  resourceAssignmentController.edit);
router.put('/resourceAssignments/edit/:id', isAuthenticated,  resourceAssignmentController.update);
router.delete("/resourceAssignments/delete/:id", isAuthenticated,  resourceAssignmentController.delete);

module.exports = router;