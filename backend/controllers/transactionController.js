const Booking = require('../models/Booking');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get completed transactions for client
// @route   GET /api/transactions/client/completed
// @access  Private/Client
exports.getClientCompletedTransactions = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, startDate, endDate } = req.query;

    // Build query for completed transactions
    const query = { 
      client: req.user.id, 
      status: 'completed',
      'payment.status': 'completed'
    };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Count total completed transactions
    const total = await Booking.countDocuments(query);

    // Build pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const transactions = await Booking.find(query)
      .populate('service', 'title category pricing')
      .populate('provider', 'firstName lastName profileImage businessName')
      .select('service provider price payment scheduledDate createdAt updatedAt status')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Calculate total spent
    const totalSpent = transactions.reduce((sum, transaction) => {
      return sum + transaction.price.amount;
    }, 0);

    res.json({
      success: true,
      count: transactions.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      },
      summary: {
        totalTransactions: total,
        totalSpent: totalSpent,
        currency: transactions.length > 0 ? transactions[0].price.currency : 'USD'
      },
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get completed transactions for provider
// @route   GET /api/transactions/provider/completed
// @access  Private/Provider
exports.getProviderCompletedTransactions = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, startDate, endDate } = req.query;

    // Build query for completed transactions
    const query = { 
      provider: req.user.id, 
      status: 'completed',
      'payment.status': 'completed'
    };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Count total completed transactions
    const total = await Booking.countDocuments(query);

    // Build pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const transactions = await Booking.find(query)
      .populate('service', 'title category pricing')
      .populate('client', 'firstName lastName profileImage')
      .select('service client price payment scheduledDate createdAt updatedAt status')
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Calculate total earned (assuming 85% after platform fee)
    const platformFeeRate = 0.15; // 15% platform fee
    const totalEarned = transactions.reduce((sum, transaction) => {
      return sum + (transaction.price.amount * (1 - platformFeeRate));
    }, 0);

    const totalGross = transactions.reduce((sum, transaction) => {
      return sum + transaction.price.amount;
    }, 0);

    res.json({
      success: true,
      count: transactions.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      },
      summary: {
        totalTransactions: total,
        totalGross: totalGross,
        totalEarned: totalEarned,
        platformFees: totalGross - totalEarned,
        currency: transactions.length > 0 ? transactions[0].price.currency : 'USD'
      },
      data: transactions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction details by ID
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Booking.findById(req.params.id)
      .populate('service', 'title category pricing description')
      .populate('client', 'firstName lastName email phone profileImage')
      .populate('provider', 'firstName lastName email phone profileImage businessName');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    // Check if the user is the client, provider, or admin
    if (
      transaction.client._id.toString() !== req.user.id &&
      transaction.provider._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this transaction'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark transaction as completed and process payment
// @route   PUT /api/transactions/:id/complete
// @access  Private/Provider
exports.completeTransaction = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { paymentMethod, transactionId } = req.body;
    
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if the user is the provider for this booking
    if (booking.provider.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to complete this transaction'
      });
    }

    // Check if booking is in progress
    if (booking.status !== 'in_progress') {
      return res.status(400).json({
        success: false,
        error: 'Booking must be in progress to complete transaction'
      });
    }

    // Update booking and payment status
    booking.status = 'completed';
    booking.payment.status = 'completed';
    booking.payment.method = paymentMethod;
    booking.payment.transactionId = transactionId;
    booking.updatedAt = Date.now();

    await booking.save();

    // Return updated booking
    const completedTransaction = await Booking.findById(booking._id)
      .populate('service', 'title category pricing')
      .populate('client', 'firstName lastName email phone')
      .populate('provider', 'firstName lastName email phone businessName');

    res.json({
      success: true,
      message: 'Transaction completed successfully',
      data: completedTransaction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get transaction summary/analytics
// @route   GET /api/transactions/summary
// @access  Private
exports.getTransactionSummary = async (req, res, next) => {
  try {
    const { period = '30' } = req.query; // Default to last 30 days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    let query = {
      status: 'completed',
      'payment.status': 'completed',
      updatedAt: { $gte: startDate }
    };

    // Filter by user role
    if (req.user.role === 'client') {
      query.client = req.user.id;
    } else if (req.user.role === 'provider') {
      query.provider = req.user.id;
    }

    const transactions = await Booking.find(query)
      .populate('service', 'category')
      .select('price service updatedAt');

    // Calculate summary statistics
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, t) => sum + t.price.amount, 0);
    
    // Group by service category
    const categoryBreakdown = transactions.reduce((acc, transaction) => {
      const category = transaction.service.category;
      if (!acc[category]) {
        acc[category] = { count: 0, amount: 0 };
      }
      acc[category].count += 1;
      acc[category].amount += transaction.price.amount;
      return acc;
    }, {});

    // Group by month for trend analysis
    const monthlyTrend = transactions.reduce((acc, transaction) => {
      const month = transaction.updatedAt.toISOString().substring(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { count: 0, amount: 0 };
      }
      acc[month].count += 1;
      acc[month].amount += transaction.price.amount;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        period: `${period} days`,
        summary: {
          totalTransactions,
          totalAmount,
          averageTransaction: totalTransactions > 0 ? totalAmount / totalTransactions : 0,
          currency: transactions.length > 0 ? transactions[0].price.currency : 'USD'
        },
        categoryBreakdown,
        monthlyTrend
      }
    });
  } catch (error) {
    next(error);
  }
};
