const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookingController = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const createBookingValidation = [
  body('service').notEmpty().withMessage('Service ID is required'),
  body('scheduledDate').notEmpty().isISO8601().withMessage('Valid scheduled date is required'),
  body('scheduledTime.startTime').notEmpty().matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time format should be HH:MM (24-hour format)'),
  body('scheduledTime.endTime').optional().matches(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time format should be HH:MM (24-hour format)')
];

const updateBookingStatusValidation = [
  body('status').isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'declined']).withMessage('Valid status is required')
];

// Client booking routes
router.post('/', protect, authorize('client'), createBookingValidation, bookingController.createBooking);
router.get('/client/bookings', protect, authorize('client'), bookingController.getClientBookings);
router.put('/:id/cancel', protect, authorize('client'), bookingController.cancelBookingClient);

// Provider booking routes
router.get('/provider/bookings', protect, authorize('provider'), bookingController.getProviderBookings);
router.put('/:id/status', protect, authorize('provider'), updateBookingStatusValidation, bookingController.updateBookingStatus);

// Common booking routes
router.get('/:id', protect, bookingController.getBookingById);

module.exports = router;