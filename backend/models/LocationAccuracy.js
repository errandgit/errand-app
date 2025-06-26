const mongoose = require('mongoose');

const LocationAccuracySchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userRole: {
    type: String,
    enum: ['client', 'provider'],
    required: true
  },
  // GPS Location Data
  gpsLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    accuracy: {
      type: Number, // Accuracy in meters
      required: true
    },
    altitude: {
      type: Number // Altitude in meters
    },
    altitudeAccuracy: {
      type: Number // Altitude accuracy in meters
    },
    heading: {
      type: Number // Direction in degrees (0-360)
    },
    speed: {
      type: Number // Speed in m/s
    }
  },
  // Address Verification
  addressVerification: {
    inputAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      fullAddress: String
    },
    verifiedAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      fullAddress: String,
      formattedAddress: String
    },
    geocodingService: {
      type: String,
      enum: ['google', 'mapbox', 'opencage', 'nominatim'],
      default: 'google'
    },
    confidence: {
      type: Number, // 0-1 confidence score
      min: 0,
      max: 1
    },
    placeId: String, // Google Places ID or equivalent
    addressComponents: [{
      longName: String,
      shortName: String,
      types: [String]
    }]
  },
  // Location Entry Validation
  entryValidation: {
    method: {
      type: String,
      enum: ['manual', 'gps', 'address_search', 'map_pin'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    deviceInfo: {
      userAgent: String,
      platform: String,
      geolocationSupported: Boolean,
      permissionStatus: {
        type: String,
        enum: ['granted', 'denied', 'prompt', 'unknown']
      }
    },
    validationStatus: {
      type: String,
      enum: ['pending', 'verified', 'failed', 'approximate'],
      default: 'pending'
    },
    validationErrors: [String]
  },
  // Distance and Proximity
  proximityData: {
    distanceToBookingLocation: {
      type: Number // Distance in meters
    },
    withinServiceRadius: {
      type: Boolean,
      default: false
    },
    serviceRadius: {
      type: Number, // Service radius in meters
      default: 5000 // 5km default
    }
  },
  // Accuracy Metrics
  accuracyMetrics: {
    locationAccuracyRating: {
      type: Number, // 1-5 rating
      min: 1,
      max: 5
    },
    addressMatchScore: {
      type: Number, // 0-100 percentage match
      min: 0,
      max: 100
    },
    overallAccuracyScore: {
      type: Number, // Composite score 0-100
      min: 0,
      max: 100
    }
  },
  // Verification History
  verificationHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    action: {
      type: String,
      enum: ['created', 'updated', 'verified', 'rejected', 'corrected']
    },
    previousLocation: {
      coordinates: [Number],
      address: String
    },
    newLocation: {
      coordinates: [Number],
      address: String
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String
  }],
  // Flags and Alerts
  flags: {
    suspiciousLocation: {
      type: Boolean,
      default: false
    },
    lowAccuracy: {
      type: Boolean,
      default: false
    },
    addressMismatch: {
      type: Boolean,
      default: false
    },
    outsideServiceArea: {
      type: Boolean,
      default: false
    }
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

// Create geospatial index for location queries
LocationAccuracySchema.index({ 'gpsLocation': '2dsphere' });

// Create compound indexes for efficient queries
LocationAccuracySchema.index({ booking: 1, userRole: 1 });
LocationAccuracySchema.index({ user: 1, createdAt: -1 });
LocationAccuracySchema.index({ 'entryValidation.validationStatus': 1 });

// Pre-save middleware to calculate accuracy scores
LocationAccuracySchema.pre('save', function(next) {
  // Calculate overall accuracy score
  let accuracyScore = 0;
  let factors = 0;

  // GPS accuracy factor (higher accuracy = lower number = better score)
  if (this.gpsLocation && this.gpsLocation.accuracy) {
    const gpsScore = Math.max(0, 100 - (this.gpsLocation.accuracy / 10));
    accuracyScore += gpsScore;
    factors++;
  }

  // Address match score factor
  if (this.accuracyMetrics && this.accuracyMetrics.addressMatchScore) {
    accuracyScore += this.accuracyMetrics.addressMatchScore;
    factors++;
  }

  // Geocoding confidence factor
  if (this.addressVerification && this.addressVerification.confidence) {
    accuracyScore += (this.addressVerification.confidence * 100);
    factors++;
  }

  // Calculate composite score
  if (factors > 0) {
    this.accuracyMetrics = this.accuracyMetrics || {};
    this.accuracyMetrics.overallAccuracyScore = Math.round(accuracyScore / factors);
  }

  // Set flags based on accuracy
  this.flags = this.flags || {};
  
  if (this.gpsLocation && this.gpsLocation.accuracy > 100) {
    this.flags.lowAccuracy = true;
  }

  if (this.accuracyMetrics && this.accuracyMetrics.addressMatchScore < 70) {
    this.flags.addressMismatch = true;
  }

  if (this.proximityData && !this.proximityData.withinServiceRadius) {
    this.flags.outsideServiceArea = true;
  }

  next();
});

module.exports = mongoose.model('LocationAccuracy', LocationAccuracySchema);
