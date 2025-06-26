const Review = require('../models/Review');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private/Client
exports.createReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { booking: bookingId, service: serviceId, provider: providerId, rating, comment } = req.body;

    // Check if booking exists and belongs to the client
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    if (booking.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to review this booking'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Cannot review a booking that has not been completed'
      });
    }

    // Check if review already exists for this booking
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: 'Review already exists for this booking'
      });
    }

    // Create review
    const review = await Review.create({
      service: serviceId,
      booking: bookingId,
      provider: providerId,
      reviewer: req.user.id,
      rating,
      comment,
      isVerified: true, // Auto-verify since it's from a confirmed booking
    });

    // Populate review details
    const populatedReview = await Review.findById(review._id)
      .populate('service', 'title')
      .populate('reviewer', 'firstName lastName profileImage');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private/Client
exports.updateReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    // Find review
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user is the reviewer
    if (review.reviewer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this review'
      });
    }

    // Update review fields
    if (rating) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    // Populate review details
    const updatedReview = await Review.findById(review._id)
      .populate('service', 'title')
      .populate('reviewer', 'firstName lastName profileImage');

    res.json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Client
exports.deleteReview = async (req, res, next) => {
  try {
    // Find review
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user is the reviewer or admin
    if (review.reviewer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a review
// @route   POST /api/reviews/:id/reply
// @access  Private/Provider
exports.replyToReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { content } = req.body;

    // Find review
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if user is the provider
    if (review.provider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to reply to this review'
      });
    }

    // Add reply
    review.reply = {
      content,
      createdAt: Date.now()
    };

    await review.save();

    // Populate review details
    const updatedReview = await Review.findById(review._id)
      .populate('service', 'title')
      .populate('reviewer', 'firstName lastName profileImage');

    res.json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
exports.getServiceReviews = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    // Build query
    const query = { 
      service: req.params.serviceId,
      isPublic: true 
    };

    // Count total reviews based on query
    const total = await Review.countDocuments(query);

    // Build pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const reviews = await Review.find(query)
      .populate('reviewer', 'firstName lastName profileImage')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      success: true,
      count: reviews.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a provider
// @route   GET /api/reviews/provider/:providerId
// @access  Public
exports.getProviderReviews = async (req, res, next) => {
  try {
    const { limit = 10, page = 1 } = req.query;

    // Build query
    const query = { 
      provider: req.params.providerId,
      isPublic: true 
    };

    // Count total reviews based on query
    const total = await Review.countDocuments(query);

    // Build pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const reviews = await Review.find(query)
      .populate('reviewer', 'firstName lastName profileImage')
      .populate('service', 'title category')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      success: true,
      count: reviews.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};