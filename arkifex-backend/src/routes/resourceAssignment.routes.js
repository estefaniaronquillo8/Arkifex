const express = require('express');
const router = express.Router();
const { resourceAssignmentController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/assignments', isAuthenticated, resourceAssignmentController.getAllAsignments);
router.post('/assignments/create', isAuthenticated, resourceAssignmentController.createResourceAssignment);
router.get('/assignments/edit/:id', isAuthenticated, resourceAssignmentController.editAssigments);
router.put('/assignments/edit/:id', isAuthenticated, resourceAssignmentController.updateResourceAssignment);
router.delete("/assignments/delete/:id", isAuthenticated, resourceAssignmentController.deleteAssignment);

module.exports = router;