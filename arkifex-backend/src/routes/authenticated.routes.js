const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/users', isAuthenticated, userController.getUsers);
router.get('/users/edit/:id', isAuthenticated, userController.edit);
router.put('/users/edit/:id', isAuthenticated, userController.update);
router.delete("/users/delete/:id", isAuthenticated, userController.delete);

module.exports = router;
