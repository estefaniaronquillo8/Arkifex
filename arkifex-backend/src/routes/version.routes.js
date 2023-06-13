const express = require('express');
const router = express.Router();
const { versionController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/versions', versionController.getVersions);
router.post('/versions/create',  versionController.create);
router.get('/versions/edit/:id',  versionController.edit);
router.put('/versions/edit/:id',  versionController.update);
router.delete("/versions/delete/:id",  versionController.delete);

module.exports = router;