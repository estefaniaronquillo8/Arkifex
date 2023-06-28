const express = require('express');
const router = express.Router();
const { reportController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.post('/reports/create/:id', reportController.createReport);
router.get('/reports/:id',  reportController.getReport);
// router.get('/reports/edit/:id',  versionController.edit);
// router.put('/reports/edit/:id',  versionController.update);
// router.delete("/reports/delete/:id",  versionController.delete);

module.exports = router;