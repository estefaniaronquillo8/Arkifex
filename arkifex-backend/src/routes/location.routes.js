const express = require('express');
const router = express.Router();
const { locationController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/locations', isAuthenticated, locationController.getLocations);
router.post('/locations/create', isAuthenticated,  locationController.create);
router.get('/locations/edit/:id', isAuthenticated,  locationController.edit);
router.put('/locations/edit/:id', isAuthenticated,  locationController.update);
router.delete("/locations/delete/:id", isAuthenticated,  locationController.delete);

module.exports = router;