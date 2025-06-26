const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const serviceController = require('../controllers/serviceController');
const { protect, authorize, isServiceProvider } = require('../middleware/auth');

// Validation middleware
const createServiceValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().isIn(['home_improvement', 'cleaning', 'moving', 'personal', 'tech', 'events', 'other']).withMessage('Valid category is required'),
  body('pricing.type').isIn(['hourly', 'fixed', 'quote']).withMessage('Valid pricing type is required'),
  body('pricing.amount').optional().isNumeric().withMessage('Pricing amount must be numeric')
];

const updateServiceValidation = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('category').optional().isIn(['home_improvement', 'cleaning', 'moving', 'personal', 'tech', 'events', 'other']).withMessage('Valid category is required'),
  body('pricing.type').optional().isIn(['hourly', 'fixed', 'quote']).withMessage('Valid pricing type is required'),
  body('pricing.amount').optional().isNumeric().withMessage('Pricing amount must be numeric')
];

// Public routes
router.get('/', serviceController.getAllServices);
router.get('/categories', serviceController.getCategories);
router.get('/:id', serviceController.getServiceById);
router.get('/search', serviceController.searchServices);

// Provider routes
router.post('/', protect, authorize('provider', 'admin'), createServiceValidation, serviceController.createService);
router.put('/:id', protect, isServiceProvider, updateServiceValidation, serviceController.updateService);
router.delete('/:id', protect, isServiceProvider, serviceController.deleteService);

// Provider service management
router.get('/provider/services', protect, authorize('provider'), serviceController.getProviderServices);
router.put('/:id/availability', protect, isServiceProvider, serviceController.updateServiceAvailability);
router.put('/:id/status', protect, isServiceProvider, serviceController.updateServiceStatus);

module.exports = router;