const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const reviewController = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const createReviewValidation = [
  body('service').notEmpty().withMessage('Service ID is required'),
  body('booking').notEmpty().withMessage('Booking ID is required'),
  body('provider').notEmpty().withMessage('Provider ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isLength({ max: 1000 }).withMessage('Comment cannot exceed 1000 characters')
];

const replyToReviewValidation = [
  body('content').notEmpty().withMessage('Reply content is required').isLength({ max: 500 }).withMessage('Reply cannot exceed 500 characters')
];

// Client review routes
router.post('/', protect, authorize('client'), createReviewValidation, reviewController.createReview);
router.put('/:id', protect, authorize('client'), reviewController.updateReview);
router.delete('/:id', protect, authorize('client'), reviewController.deleteReview);

// Provider review routes
router.post('/:id/reply', protect, authorize('provider'), replyToReviewValidation, reviewController.replyToReview);

// Public review routes
router.get('/service/:serviceId', reviewController.getServiceReviews);
router.get('/provider/:providerId', reviewController.getProviderReviews);

module.exports = router;