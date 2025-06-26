const jwt = require('jsonwebtoken');

// Mock user data (same as in authController)
const mockUsers = [
  {
    _id: '1',
    firstName: 'Demo',
    lastName: 'User',
    email: 'demo@example.com',
    password: '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aAdiygJPFzm', // hashed 'password'
    role: 'client',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    firstName: 'Service',
    lastName: 'Provider',
    email: 'provider@example.com',
    password: '$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aAdiygJPFzm', // hashed 'password'
    role: 'provider',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    // In development mode with mock database, bypass authentication
    // and set user as demo client for ease of testing
    if (process.env.NODE_ENV !== 'production' && global.mockDatabase) {
      console.log('Development mode: Bypassing authentication');
      req.user = {
        id: '1',
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        role: 'client',
        isVerified: true
      };
      return next();
    }
    
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized to access this route' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'errand_app_secret');

      // Find user by id
      const user = mockUsers.find(user => user._id === decoded.id);
      
      // Check if user exists
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'User not found' 
        });
      }

      // Create a user object without password
      const { password, ...userData } = user;
      req.user = { ...userData, id: user._id };

      next();
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized, token invalid' 
      });
    }
  } catch (error) {
    next(error);
  }
};

// Middleware to check user role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `User role ${req.user ? req.user.role : 'undefined'} is not authorized to access this route` 
      });
    }
    next();
  };
};

// Middleware to check if user is service provider
exports.isServiceProvider = async (req, res, next) => {
  try {
    // Check if user is a provider and has the right to modify the service
    const serviceId = req.params.id || req.params.serviceId;
    
    if (serviceId) {
      const Service = require('../models/Service');
      const service = await Service.findById(serviceId);
      
      if (!service) {
        return res.status(404).json({
          success: false,
          error: 'Service not found'
        });
      }
      
      // Check if user owns this service
      if (service.provider.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to modify this service'
        });
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
};