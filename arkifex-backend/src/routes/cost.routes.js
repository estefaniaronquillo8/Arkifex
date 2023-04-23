const express = require('express');
const router = express.Router();
const { costController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/costs', isAuthenticated, costController.getCosts);
router.get('/costs/edit/:id', isAuthenticated, costController.edit);
router.put('/costs/edit/:id', isAuthenticated, costController.update);
router.delete("/costs/delete/:id", isAuthenticated, costController.delete);

module.exports = router;