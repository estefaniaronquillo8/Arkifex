const express = require('express');
const router = express.Router();
const { userController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.post('/auth/register', userController.register);
router.post('/auth/login', userController.login);
router.get('/users', isAuthenticated, userController.getUsers);
router.get('/users/edit/:id', isAuthenticated, userController.edit);
router.put('/users/edit/:id', isAuthenticated, userController.update);
router.delete("/users/delete/:id", isAuthenticated, userController.delete);

module.exports = router;