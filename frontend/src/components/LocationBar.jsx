import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import LocationSelector from './LocationSelector';
import '../styles/LocationBar.css';
import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import SpaceBetween from '@cloudscape-design/components/space-between';

const LocationBar = () => {
  const { 
    location, 
    locationPermission, 
    loading, 
    requestLocationPermission,
    setManualLocation 
  } = useLocation();
  
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  
  const handleRequestLocation = () => {
    requestLocationPermission();
  };
  
  const handleEditLocation = () => {
    setShowLocationSelector(true);
  };
  
  const handleSaveLocation = () => {
    if (manualInput.trim()) {
      setManualLocation({
        city: manualInput,
        region: '',
        country: '',
        manual: true
      });
    }
    setIsEditingLocation(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditingLocation(false);
    setManualInput('');
  };

  // Render loading state
  if (loading) {
    return (
      <Box padding="xs" backgroundColor="light">
        <SpaceBetween direction="horizontal" size="xs">
          <span role="img" aria-label="location">📍</span>
          <Box variant="p" color="text-status-info">Finding your location...</Box>
        </SpaceBetween>
      </Box>
    );
  }
  
  // Render error state when permission is denied
  if (locationPermission === 'denied' && !location) {
    return (
      <Box padding="xs" backgroundColor="light">
        <SpaceBetween direction="horizontal" size="xs" alignItems="center">
          <span role="img" aria-label="location">📍</span>
          <Box variant="p" color="text-status-error">Location access denied</Box>
          <Button 
            variant="link" 
            onClick={handleEditLocation}
          >
            Set location manually
          </Button>
        </SpaceBetween>
        
        {isEditingLocation && (
          <Box margin={{ top: "s" }}>
            <SpaceBetween direction="horizontal" size="xs">
              <input
                type="text"
                className="location-input"
                placeholder="Enter your city"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
              />
              <SpaceBetween direction="horizontal" size="xs">
                <Button onClick={handleSaveLocation} variant="primary">Save</Button>
                <Button onClick={handleCancelEdit}>Cancel</Button>
              </SpaceBetween>
            </SpaceBetween>
          </Box>
        )}
      </Box>
    );
  }
  
  // Render normal state with location
  return (
    <Box padding="xs" backgroundColor="light">
      <SpaceBetween direction="horizontal" size="xs" alignItems="center">
        <span role="img" aria-label="location">📍</span>
        <Box variant="p">
          {location ? location.city : 'Location not available'}
        </Box>
        <Button 
          variant="link" 
          onClick={handleEditLocation}
        >
          Change
        </Button>
      </SpaceBetween>
      
      {showLocationSelector && (
        <div className="location-selector-modal">
          <div className="location-selector-backdrop" onClick={() => setShowLocationSelector(false)}></div>
          <div className="location-selector-content">
            <LocationSelector onClose={() => setShowLocationSelector(false)} />
          </div>
        </div>
      )}
    </Box>
  );
};

export default LocationBar;