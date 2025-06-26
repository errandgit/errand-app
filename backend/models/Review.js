const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  reply: {
    content: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for faster queries
ReviewSchema.index({ service: 1 });
ReviewSchema.index({ provider: 1 });
ReviewSchema.index({ booking: 1 }, { unique: true });

// Update service rating when a review is created or updated
ReviewSchema.post('save', async function() {
  const Service = mongoose.model('Service');
  
  try {
    // Calculate the new average rating
    const result = await this.constructor.aggregate([
      { $match: { service: this.service } },
      { 
        $group: {
          _id: '$service',
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    if (result.length > 0) {
      // Update the service with the new average rating and count
      await Service.findByIdAndUpdate(this.service, {
        'rating.average': result[0].averageRating,
        'rating.count': result[0].count
      });
    }
  } catch (error) {
    console.error('Error updating service rating:', error);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);