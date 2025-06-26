import React, { useState, useEffect } from 'react';
import '../styles/LocationEntry.css';

const LocationEntry = ({ bookingId, onLocationValidated, initialLocation = null }) => {
  const [location, setLocation] = useState({
    gps: null,
    address: '',
    method: 'gps'
  });
  const [accuracy, setAccuracy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('unknown');

  useEffect(() => {
    checkGeolocationSupport();
    if (initialLocation) {
      setLocation(prev => ({
        ...prev,
        address: initialLocation.address || '',
        gps: initialLocation.coordinates || null
      }));
    }
  }, [initialLocation]);

  const checkGeolocationSupport = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return false;
    }
    return true;
  };

  const getCurrentLocation = () => {
    if (!checkGeolocationSupport()) return;

    setLoading(true);
    setError('');

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000 // 1 minute
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } = position.coords;
        
        setLocation(prev => ({
          ...prev,
          gps: {
            coordinates: [longitude, latitude],
            accuracy: accuracy,
            altitude: altitude,
            altitudeAccuracy: altitudeAccuracy,
            heading: heading,
            speed: speed
          },
          method: 'gps'
        }));
        
        setAccuracy(accuracy);
        setPermissionStatus('granted');
        setLoading(false);

        // Auto-validate if accuracy is good
        if (accuracy <= 50) {
          validateLocation({
            coordinates: [longitude, latitude],
            accuracy: accuracy,
            altitude: altitude,
            altitudeAccuracy: altitudeAccuracy,
            heading: heading,
            speed: speed
          });
        }
      },
      (error) => {
        setLoading(false);
        setPermissionStatus('denied');
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services and try again.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable. Please try again.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      options
    );
  };

  const validateLocation = async (gpsData = location.gps) => {
    if (!gpsData && !location.address) {
      setError('Please provide either GPS location or address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        geolocationSupported: !!navigator.geolocation,
        permissionStatus: permissionStatus
      };

      const requestData = {
        bookingId: bookingId,
        entryMethod: location.method,
        deviceInfo: deviceInfo
      };

      if (gpsData) {
        requestData.gpsLocation = gpsData;
      }

      if (location.address) {
        requestData.addressInput = {
          fullAddress: location.address
        };
      }

      const response = await fetch('/api/location/validate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        setValidationResult(data.data);
        if (onLocationValidated) {
          onLocationValidated(data.data);
        }
      } else {
        setError(data.error || 'Location validation failed');
      }
    } catch (err) {
      setError('Network error occurred during validation');
      console.error('Location validation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setLocation(prev => ({
      ...prev,
      address: e.target.value,
      method: 'address_search'
    }));
  };

  const handleMethodChange = (method) => {
    setLocation(prev => ({
      ...prev,
      method: method
    }));
    setValidationResult(null);
  };

  const getAccuracyStatus = () => {
    if (!accuracy) return null;
    
    if (accuracy <= 10) return { status: 'excellent', color: '#34c759', text: 'Excellent' };
    if (accuracy <= 50) return { status: 'good', color: '#007aff', text: 'Good' };
    if (accuracy <= 100) return { status: 'fair', color: '#ff9500', text: 'Fair' };
    return { status: 'poor', color: '#ff3b30', text: 'Poor' };
  };

  const accuracyStatus = getAccuracyStatus();

  return (
    <div className="location-entry">
      <div className="location-entry-header">
        <h3>📍 Location Verification</h3>
        <p>Verify your location for accurate service delivery</p>
      </div>

      {/* Method Selection */}
      <div className="method-selection">
        <button
          className={`method-btn ${location.method === 'gps' ? 'active' : ''}`}
          onClick={() => handleMethodChange('gps')}
        >
          📱 Use GPS
        </button>
        <button
          className={`method-btn ${location.method === 'address_search' ? 'active' : ''}`}
          onClick={() => handleMethodChange('address_search')}
        >
          🏠 Enter Address
        </button>
      </div>

      {/* GPS Location */}
      {location.method === 'gps' && (
        <div className="gps-section">
          <button
            onClick={getCurrentLocation}
            disabled={loading}
            className="gps-btn"
          >
            {loading ? '📍 Getting Location...' : '📍 Get Current Location'}
          </button>

          {location.gps && (
            <div className="gps-info">
              <div className="coordinates">
                <strong>Coordinates:</strong> {location.gps.coordinates[1].toFixed(6)}, {location.gps.coordinates[0].toFixed(6)}
              </div>
              
              {accuracyStatus && (
                <div className="accuracy-info">
                  <span className="accuracy-label">Accuracy:</span>
                  <span 
                    className="accuracy-value"
                    style={{ color: accuracyStatus.color }}
                  >
                    ±{Math.round(accuracy)}m ({accuracyStatus.text})
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Address Entry */}
      {location.method === 'address_search' && (
        <div className="address-section">
          <input
            type="text"
            placeholder="Enter your full address"
            value={location.address}
            onChange={handleAddressChange}
            className="address-input"
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Validation Button */}
      <button
        onClick={() => validateLocation()}
        disabled={loading || (!location.gps && !location.address)}
        className="validate-btn"
      >
        {loading ? 'Validating...' : 'Validate Location'}
      </button>

      {/* Validation Result */}
      {validationResult && (
        <div className="validation-result">
          <div className="result-header">
            <span className={`status-icon ${validationResult.entryValidation.validationStatus}`}>
              {validationResult.entryValidation.validationStatus === 'verified' ? '✅' :
               validationResult.entryValidation.validationStatus === 'approximate' ? '⚠️' : '❌'}
            </span>
            <span className="status-text">
              Location {validationResult.entryValidation.validationStatus}
            </span>
          </div>

          {validationResult.accuracyMetrics && (
            <div className="accuracy-metrics">
              <div className="metric">
                <span>Overall Score:</span>
                <span className="score">
                  {validationResult.accuracyMetrics.overallAccuracyScore || 0}/100
                </span>
              </div>
              
              {validationResult.proximityData && (
                <div className="metric">
                  <span>Distance to Service Area:</span>
                  <span className="distance">
                    {Math.round(validationResult.proximityData.distanceToBookingLocation || 0)}m
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Flags and Warnings */}
          {validationResult.flags && Object.values(validationResult.flags).some(flag => flag) && (
            <div className="validation-warnings">
              <h4>⚠️ Warnings:</h4>
              <ul>
                {validationResult.flags.lowAccuracy && <li>GPS accuracy is low</li>}
                {validationResult.flags.addressMismatch && <li>Address doesn't match GPS location</li>}
                {validationResult.flags.outsideServiceArea && <li>Location is outside service area</li>}
                {validationResult.flags.suspiciousLocation && <li>Location appears suspicious</li>}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="location-tips">
        <h4>💡 Tips for Better Accuracy:</h4>
        <ul>
          <li>Enable location services in your browser</li>
          <li>Use GPS outdoors for best accuracy</li>
          <li>Ensure you're at the correct service location</li>
          <li>Double-check your address if entering manually</li>
        </ul>
      </div>
    </div>
  );
};

export default LocationEntry;
