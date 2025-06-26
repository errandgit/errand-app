const mongoose = require('mongoose');

// In-memory MongoDB for local development
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedData = require('../data/seedData');

let mongoServer;

const connectDB = async () => {
  console.log('Starting database connection...');
  try {
    // For local development without MongoDB Atlas
    console.log('Creating MongoDB Memory Server...');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    console.log(`MongoDB Memory Server URI: ${mongoUri}`);
    
    // Remove deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI || mongoUri);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Check if we need to seed the database
    const User = mongoose.models.User || require('../models/User');
    const usersCount = await User.countDocuments();
    
    if (usersCount === 0) {
      console.log('Seeding database with initial data...');
      
      // Import models
      const Service = mongoose.models.Service || require('../models/Service');
      const Booking = mongoose.models.Booking || require('../models/Booking');
      const Review = mongoose.models.Review || require('../models/Review');
      
      // Insert users first
      console.log('Inserting users...');
      const insertedUsers = await User.insertMany(seedData.users);
      
      // Create a map of user references
      const userMap = {
        'Demo': insertedUsers[0]._id, // Demo User
        'Sarah': insertedUsers[1]._id, // Sarah Johnson
        'Mike': insertedUsers[2]._id   // Mike Chen
      };
      
      // Update service providers with actual user IDs
      console.log('Inserting services with user references...');
      const serviceData = seedData.services.map((service, index) => {
        if (index === 0 || index === 2) { // Professional Cleaning and Hair Braiding
          service.provider = userMap['Sarah']; // Sarah
        } else { // Furniture Assembly, Moving, African Cuisine
          service.provider = userMap['Mike']; // Mike
        }
        return service;
      });
      
      const insertedServices = await Service.insertMany(serviceData);
      
      // Create a map of service references
      const serviceMap = {};
      insertedServices.forEach((service, index) => {
        serviceMap[index] = service._id;
      });
      
      // Update bookings with references
      console.log('Inserting bookings with user and service references...');
      const bookingData = seedData.bookings.map((booking, index) => {
        if (index === 0) { // First booking
          booking.service = serviceMap[0]; // Professional Home Cleaning
          booking.provider = userMap['Sarah']; // Sarah
        } else { // Second booking
          booking.service = serviceMap[1]; // Furniture Assembly
          booking.provider = userMap['Mike']; // Mike
        }
        booking.client = userMap['Demo']; // Demo User as client for all bookings
        return booking;
      });
      
      const insertedBookings = await Booking.insertMany(bookingData);
      
      // Update reviews with references
      console.log('Inserting reviews with proper references...');
      const reviewData = seedData.reviews.map(review => {
        review.service = serviceMap[0]; // Professional Home Cleaning
        review.booking = insertedBookings[0]._id; // First booking
        review.reviewer = userMap['Demo']; // Demo User
        review.provider = userMap['Sarah']; // Sarah
        return review;
      });
      
      await Review.insertMany(reviewData);
      
      console.log('Database seeded successfully!');
    }
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error(`Stack trace: ${error.stack}`);
    console.log('Falling back to in-memory mock data');
    
    // If MongoDB connection fails, use in-memory data for development
    global.mockDatabase = seedData;
    console.log('Using mock database with sample data');
  }
  
  return;
};

module.exports = connectDB;