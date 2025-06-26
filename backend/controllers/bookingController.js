const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/Client
exports.createBooking = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { service: serviceId, scheduledDate, scheduledTime, requirements } = req.body;

    // Check if service exists
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      });
    }

    // Check if service is active
    if (!service.isActive) {
      return res.status(400).json({
        success: false,
        error: 'This service is currently unavailable'
      });
    }

    // Calculate price based on service pricing
    let price = {
      amount: service.pricing.type === 'quote' ? 0 : service.pricing.amount,
      currency: service.pricing.currency
    };

    // Create booking object
    const bookingData = {
      service: serviceId,
      client: req.user.id,
      provider: service.provider,
      status: 'pending',
      scheduledDate,
      scheduledTime,
      requirements: requirements || '',
      price,
      location: req.body.location || {}
    };

    // Create booking
    const booking = await Booking.create(bookingData);

    // Populate booking with service and provider details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('service', 'title category pricing')
      .populate('provider', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    // Use mock data if mongoose isn't connected
    if (global.mockDatabase) {
      const booking = mockBookings.find(booking => booking._id === req.params.id);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          error: 'Booking not found'
        });
      }
      
      // Note: In mock mode we skip the authorization check for simplicity
      
      return res.json({
        success: true,
        data: booking
      });
    }
    
    // If mongoose is connected, use the original code
    const booking = await Booking.findById(req.params.id)
      .populate('service', 'title category pricing')
      .populate('client', 'firstName lastName email phone')
      .populate('provider', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if the user is the client, provider, or admin
    if (
      booking.client._id.toString() !== req.user.id &&
      booking.provider._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this booking'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// Mock bookings data
const mockBookings = [
  {
    _id: '201',
    service: {
      _id: '101',
      title: 'Professional Home Cleaning',
      category: 'cleaning',
      pricing: {
        type: 'fixed',
        amount: 120,
        currency: 'USD'
      }
    },
    client: {
      _id: '1',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      phone: '123-456-7890',
      profileImage: 'https://via.placeholder.com/150'
    },
    provider: {
      _id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      phone: '234-567-8901',
      profileImage: 'https://via.placeholder.com/150'
    },
    status: 'completed',
    scheduledDate: new Date('2025-05-15'),
    scheduledTime: {
      startTime: '10:00',
      endTime: '13:00'
    },
    price: {
      amount: 75,
      currency: 'USD'
    },
    createdAt: new Date('2025-05-10'),
    updatedAt: new Date('2025-05-15')
  },
  {
    _id: '202',
    service: {
      _id: '102',
      title: 'Furniture Assembly',
      category: 'home_improvement',
      pricing: {
        type: 'fixed',
        amount: 60,
        currency: 'USD'
      }
    },
    client: {
      _id: '1',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      phone: '123-456-7890',
      profileImage: 'https://via.placeholder.com/150'
    },
    provider: {
      _id: '3',
      firstName: 'Mike',
      lastName: 'Chen',
      email: 'mike@example.com',
      phone: '345-678-9012',
      profileImage: 'https://via.placeholder.com/150'
    },
    status: 'scheduled',
    scheduledDate: new Date('2025-06-30'),
    scheduledTime: {
      startTime: '14:00',
      endTime: '16:00'
    },
    price: {
      amount: 60,
      currency: 'USD'
    },
    createdAt: new Date('2025-06-25'),
    updatedAt: new Date('2025-06-25')
  }
];

// @desc    Get client bookings
// @route   GET /api/bookings/client/bookings
// @access  Private/Client
exports.getClientBookings = async (req, res, next) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;

    // Use mock data if mongoose isn't connected
    if (global.mockDatabase) {
      // Filter mock bookings based on status if provided
      let filteredBookings = [...mockBookings];
      if (status) {
        filteredBookings = filteredBookings.filter(booking => booking.status === status);
      }

      // Apply pagination
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

      return res.json({
        success: true,
        count: paginatedBookings.length,
        pagination: {
          total: filteredBookings.length,
          page: parseInt(page),
          pages: Math.ceil(filteredBookings.length / parseInt(limit))
        },
        data: paginatedBookings
      });
    }

    // If mongoose is connected, use the original code
    // Build query
    const query = { client: req.user.id };
    if (status) query.status = status;

    // Count total bookings based on query
    const total = await Booking.countDocuments(query);

    // Build pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const bookings = await Booking.find(query)
      .populate('service', 'title category pricing')
      .populate('provider', 'firstName lastName profileImage')
      .sort({ scheduledDate: 1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      success: true,
      count: bookings.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get provider bookings
// @route   GET /api/bookings/provider/bookings
// @access  Private/Provider
exports.getProviderBookings = async (req, res, next) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;

    // Build query
    const query = { provider: req.user.id };
    if (status) query.status = status;

    // Count total bookings based on query
    const total = await Booking.countDocuments(query);

    // Build pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const bookings = await Booking.find(query)
      .populate('service', 'title category pricing')
      .populate('client', 'firstName lastName profileImage')
      .sort({ scheduledDate: 1 })
      .limit(parseInt(limit))
      .skip(skip);

    res.json({
      success: true,
      count: bookings.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Provider
exports.updateBookingStatus = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { status } = req.body;
    
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
        error: 'Not authorized to update this booking'
      });
    }

    // Update booking status
    booking.status = status;

    // If cancelling, add cancellation details
    if (status === 'cancelled') {
      booking.cancellation = {
        reason: req.body.reason || 'Cancelled by provider',
        cancelledBy: req.user.id,
        cancelledAt: Date.now()
      };
    }

    await booking.save();

    // Return updated booking
    const updatedBooking = await Booking.findById(booking._id)
      .populate('service', 'title category pricing')
      .populate('client', 'firstName lastName email phone')
      .populate('provider', 'firstName lastName email phone');

    res.json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking by client
// @route   PUT /api/bookings/:id/cancel
// @access  Private/Client
exports.cancelBookingClient = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if the user is the client for this booking
    if (booking.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking is already completed
    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        error: `Booking cannot be cancelled as it is already ${booking.status}`
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellation = {
      reason: req.body.reason || 'Cancelled by client',
      cancelledBy: req.user.id,
      cancelledAt: Date.now()
    };

    await booking.save();

    // Return updated booking
    const updatedBooking = await Booking.findById(booking._id)
      .populate('service', 'title category pricing')
      .populate('client', 'firstName lastName email phone')
      .populate('provider', 'firstName lastName email phone');

    res.json({
      success: true,
      data: updatedBooking
    });
  } catch (error) {
    next(error);
  }
};