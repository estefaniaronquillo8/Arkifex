const express = require('express');
const router = express.Router();
const { reportController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.post('/reports/create/:id', reportController.createReport);
router.get('/reports/:id',  reportController.getReportByDate);
router.get('/reports/all/:id',  reportController.getAllReports);
router.get('/reports/detail/:id',  reportController.getDetailReports);
// router.get('/reports/edit/:id',  versionController.edit);
// router.put('/reports/edit/:id',  versionController.update);
// router.delete("/reports/delete/:id",  versionController.delete);

module.exports = router;