const LocationAccuracy = require('../models/LocationAccuracy');
const Booking = require('../models/Booking');
const { validationResult } = require('express-validator');

// @desc    Validate and record location entry
// @route   POST /api/location/validate
// @access  Private
exports.validateLocationEntry = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const {
      bookingId,
      gpsLocation,
      addressInput,
      entryMethod,
      deviceInfo
    } = req.body;

    // Verify booking exists and user has access
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check user authorization
    const userRole = booking.client.toString() === req.user.id ? 'client' : 
                    booking.provider.toString() === req.user.id ? 'provider' : null;
    
    if (!userRole) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to validate location for this booking'
      });
    }

    // Create location accuracy record
    const locationData = {
      booking: bookingId,
      user: req.user.id,
      userRole: userRole,
      gpsLocation: gpsLocation,
      entryValidation: {
        method: entryMethod,
        deviceInfo: deviceInfo,
        validationStatus: 'pending'
      }
    };

    // Add address data if provided
    if (addressInput) {
      locationData.addressVerification = {
        inputAddress: addressInput
      };
    }

    // Validate GPS accuracy
    if (gpsLocation && gpsLocation.accuracy) {
      if (gpsLocation.accuracy > 100) {
        locationData.flags = { lowAccuracy: true };
        locationData.entryValidation.validationErrors = ['GPS accuracy is low (>100m)'];
      }
    }

    // Calculate distance to booking location if booking has location
    if (booking.location && booking.location.coordinates && gpsLocation) {
      const distance = calculateDistance(
        gpsLocation.coordinates,
        booking.location.coordinates
      );
      
      locationData.proximityData = {
        distanceToBookingLocation: distance,
        withinServiceRadius: distance <= 5000, // 5km default
        serviceRadius: 5000
      };
    }

    const locationAccuracy = await LocationAccuracy.create(locationData);

    // Geocode address if provided
    if (addressInput && addressInput.fullAddress) {
      try {
        const geocodedData = await geocodeAddress(addressInput.fullAddress);
        if (geocodedData) {
          locationAccuracy.addressVerification.verifiedAddress = geocodedData.address;
          locationAccuracy.addressVerification.confidence = geocodedData.confidence;
          locationAccuracy.addressVerification.placeId = geocodedData.placeId;
          locationAccuracy.accuracyMetrics.addressMatchScore = geocodedData.matchScore;
          
          await locationAccuracy.save();
        }
      } catch (geocodeError) {
        console.error('Geocoding error:', geocodeError);
      }
    }

    // Set validation status based on accuracy
    if (locationAccuracy.accuracyMetrics.overallAccuracyScore >= 80) {
      locationAccuracy.entryValidation.validationStatus = 'verified';
    } else if (locationAccuracy.accuracyMetrics.overallAccuracyScore >= 60) {
      locationAccuracy.entryValidation.validationStatus = 'approximate';
    } else {
      locationAccuracy.entryValidation.validationStatus = 'failed';
    }

    await locationAccuracy.save();

    res.status(201).json({
      success: true,
      data: locationAccuracy,
      message: `Location ${locationAccuracy.entryValidation.validationStatus}`
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get location accuracy for booking
// @route   GET /api/location/booking/:bookingId
// @access  Private
exports.getBookingLocationAccuracy = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    // Verify booking access
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check authorization
    if (booking.client.toString() !== req.user.id && 
        booking.provider.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view location data for this booking'
      });
    }

    const locationAccuracy = await LocationAccuracy.find({ booking: bookingId })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: locationAccuracy
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update location accuracy
// @route   PUT /api/location/:id/update
// @access  Private
exports.updateLocationAccuracy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { gpsLocation, addressInput, notes } = req.body;

    const locationAccuracy = await LocationAccuracy.findById(id);
    if (!locationAccuracy) {
      return res.status(404).json({
        success: false,
        error: 'Location record not found'
      });
    }

    // Check authorization
    if (locationAccuracy.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this location record'
      });
    }

    // Store previous location for history
    const previousLocation = {
      coordinates: locationAccuracy.gpsLocation.coordinates,
      address: locationAccuracy.addressVerification?.inputAddress?.fullAddress
    };

    // Update location data
    if (gpsLocation) {
      locationAccuracy.gpsLocation = { ...locationAccuracy.gpsLocation, ...gpsLocation };
    }

    if (addressInput) {
      locationAccuracy.addressVerification.inputAddress = addressInput;
    }

    // Add to verification history
    locationAccuracy.verificationHistory.push({
      action: 'updated',
      previousLocation: previousLocation,
      newLocation: {
        coordinates: locationAccuracy.gpsLocation.coordinates,
        address: addressInput?.fullAddress
      },
      verifiedBy: req.user.id,
      notes: notes
    });

    await locationAccuracy.save();

    res.json({
      success: true,
      data: locationAccuracy,
      message: 'Location updated successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get location accuracy statistics
// @route   GET /api/location/stats
// @access  Private
exports.getLocationStats = async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    let query = { createdAt: { $gte: startDate } };

    // Filter by user if not admin
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const stats = await LocationAccuracy.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalEntries: { $sum: 1 },
          averageAccuracy: { $avg: '$gpsLocation.accuracy' },
          averageOverallScore: { $avg: '$accuracyMetrics.overallAccuracyScore' },
          verifiedCount: {
            $sum: {
              $cond: [{ $eq: ['$entryValidation.validationStatus', 'verified'] }, 1, 0]
            }
          },
          approximateCount: {
            $sum: {
              $cond: [{ $eq: ['$entryValidation.validationStatus', 'approximate'] }, 1, 0]
            }
          },
          failedCount: {
            $sum: {
              $cond: [{ $eq: ['$entryValidation.validationStatus', 'failed'] }, 1, 0]
            }
          },
          lowAccuracyCount: {
            $sum: {
              $cond: ['$flags.lowAccuracy', 1, 0]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalEntries: 0,
      averageAccuracy: 0,
      averageOverallScore: 0,
      verifiedCount: 0,
      approximateCount: 0,
      failedCount: 0,
      lowAccuracyCount: 0
    };

    // Calculate percentages
    if (result.totalEntries > 0) {
      result.verificationRate = Math.round((result.verifiedCount / result.totalEntries) * 100);
      result.accuracyRate = Math.round(((result.verifiedCount + result.approximateCount) / result.totalEntries) * 100);
    } else {
      result.verificationRate = 0;
      result.accuracyRate = 0;
    }

    res.json({
      success: true,
      data: {
        period: `${period} days`,
        stats: result
      }
    });

  } catch (error) {
    next(error);
  }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(coords1, coords2) {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;
  
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

// Mock geocoding function (replace with actual service like Google Maps API)
async function geocodeAddress(address) {
  // This would integrate with a real geocoding service
  // For now, return mock data
  return {
    address: {
      street: 'Mock Street',
      city: 'Mock City',
      state: 'Mock State',
      zipCode: '12345',
      country: 'US',
      formattedAddress: address
    },
    confidence: 0.85,
    placeId: 'mock_place_id',
    matchScore: 85
  };
}
