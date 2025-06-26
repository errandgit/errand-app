const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'errand_app_secret', {
    expiresIn: '30d'
  });
};

// Mock user data for demo
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

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Check if user already exists
    const userExists = mockUsers.find(user => user.email === email);

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = {
      _id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || 'client',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to mock users
    mockUsers.push(newUser);

    // Generate token
    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }

  try {
    const { email, password } = req.body;

    // Check for user
    const user = mockUsers.find(user => user.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    // Find user by id
    const user = mockUsers.find(user => user._id === req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Return user without password
    const { password, ...userData } = user;

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = mockUsers.find(user => user.email === email);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // In a real application, we would generate a reset token and send an email
    // For this demo, we'll just acknowledge the request
    
    res.json({
      success: true,
      message: 'Password reset instructions sent to email'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { resetToken } = req.params;

    // In a real application, we would verify the reset token
    // For this demo, we'll just acknowledge the request
    
    res.json({
      success: true,
      message: 'Password has been reset'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find user by id
    const userIndex = mockUsers.findIndex(user => user._id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = mockUsers[userIndex];

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    mockUsers[userIndex] = {
      ...user,
      password: hashedPassword,
      updatedAt: new Date()
    };

    // Generate new token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      message: 'Password updated successfully'
    });
  } catch (error) {
    next(error);
  }
};