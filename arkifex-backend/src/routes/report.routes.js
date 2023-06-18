const express = require('express');
const router = express.Router();
const { reportController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/reports/:id', reportController.getReports);
// router.post('/reports/create',  versionController.create);
// router.get('/reports/edit/:id',  versionController.edit);
// router.put('/reports/edit/:id',  versionController.update);
// router.delete("/reports/delete/:id",  versionController.delete);

module.exports = router;