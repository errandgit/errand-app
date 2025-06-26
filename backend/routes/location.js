const express = require('express');
const { body } = require('express-validator');
const {
  validateLocationEntry,
  getBookingLocationAccuracy,
  updateLocationAccuracy,
  getLocationStats
} = require('../controllers/locationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @route   POST /api/location/validate
// @desc    Validate and record location entry
// @access  Private
router.post('/validate', [
  body('bookingId')
    .isMongoId()
    .withMessage('Valid booking ID is required'),
  body('gpsLocation.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('GPS coordinates must be an array of [longitude, latitude]'),
  body('gpsLocation.accuracy')
    .isNumeric()
    .withMessage('GPS accuracy must be a number'),
  body('entryMethod')
    .isIn(['manual', 'gps', 'address_search', 'map_pin'])
    .withMessage('Invalid entry method'),
  body('addressInput.fullAddress')
    .optional()
    .isString()
    .withMessage('Address must be a string')
], validateLocationEntry);

// @route   GET /api/location/booking/:bookingId
// @desc    Get location accuracy for booking
// @access  Private
router.get('/booking/:bookingId', getBookingLocationAccuracy);

// @route   PUT /api/location/:id/update
// @desc    Update location accuracy
// @access  Private
router.put('/:id/update', [
  body('gpsLocation.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 })
    .withMessage('GPS coordinates must be an array of [longitude, latitude]'),
  body('gpsLocation.accuracy')
    .optional()
    .isNumeric()
    .withMessage('GPS accuracy must be a number'),
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
], updateLocationAccuracy);

// @route   GET /api/location/stats
// @desc    Get location accuracy statistics
// @access  Private
router.get('/stats', getLocationStats);

module.exports = router;
