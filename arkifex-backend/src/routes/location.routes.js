const express = require('express');
const router = express.Router();
const { locationController } = require('../controllers');
const { isAuthenticated } = require('../middlewares/authentication');

router.get('/locations', isAuthenticated, locationController.getLocations);
router.post('/locations/create', isAuthenticated, locationController.createLocation);
router.get('/locations/edit/:id', isAuthenticated, locationController.editLocations);
router.put('/locations/edit/:id', isAuthenticated, locationController.updateLocation);
router.delete("/locations/delete/:id", isAuthenticated, locationController.deleteLocation);

module.exports = router;