const express = require('express');
const { body } = require('express-validator');
const {
  getClientCompletedTransactions,
  getProviderCompletedTransactions,
  getTransactionById,
  completeTransaction,
  getTransactionSummary
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(protect);

// @route   GET /api/transactions/client/completed
// @desc    Get completed transactions for client
// @access  Private/Client
router.get('/client/completed', authorize('client'), getClientCompletedTransactions);

// @route   GET /api/transactions/provider/completed
// @desc    Get completed transactions for provider
// @access  Private/Provider
router.get('/provider/completed', authorize('provider'), getProviderCompletedTransactions);

// @route   GET /api/transactions/summary
// @desc    Get transaction summary/analytics
// @access  Private
router.get('/summary', getTransactionSummary);

// @route   GET /api/transactions/:id
// @desc    Get transaction details by ID
// @access  Private
router.get('/:id', getTransactionById);

// @route   PUT /api/transactions/:id/complete
// @desc    Mark transaction as completed and process payment
// @access  Private/Provider
router.put('/:id/complete', [
  authorize('provider'),
  body('paymentMethod')
    .isIn(['credit_card', 'paypal', 'bank_transfer', 'cash'])
    .withMessage('Invalid payment method'),
  body('transactionId')
    .optional()
    .isString()
    .withMessage('Transaction ID must be a string')
], completeTransaction);

module.exports = router;
