import React, { createContext, useState, useEffect, useContext } from 'react';

// Create location context
export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('pending'); // 'granted', 'denied', 'pending'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSelectedLocation, setUserSelectedLocation] = useState(null);

  // Function to get approximate location from IP address
  const getLocationFromIP = async () => {
    try {
      // In a real app, we would use a service like ipapi.co, ipinfo.io, etc.
      // For this demo, we'll simulate a response
      // Note: In production, this would be an API call to a geolocation service
      
      // Simulated API response
      const mockResponse = {
        city: 'New York',
        region: 'NY',
        country: 'United States',
        postal: '10001',
        latitude: 40.7128,
        longitude: -74.0060
      };

      return mockResponse;
    } catch (err) {
      console.error('Error fetching location from IP:', err);
      return null;
    }
  };

  // Function to get precise location from browser geolocation API
  const getLocationFromBrowser = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setLocationPermission('unsupported');
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // In a real app, we would reverse geocode the coordinates
            // For this demo, we'll simulate a response with the coordinates
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
            // Normally we'd call a reverse geocoding API here
            // For demo purposes, just using coordinates
            const locationData = {
              city: 'Near Your Location',
              region: '',
              country: '',
              postal: '',
              latitude,
              longitude,
              accuracy: position.coords.accuracy
            };
            
            setLocationPermission('granted');
            resolve(locationData);
          } catch (err) {
            reject(err);
          }
        },
        (err) => {
          setLocationPermission('denied');
          reject(err);
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    });
  };

  // Initialize location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      try {
        setLoading(true);
        
        // First try browser geolocation for more precise location
        try {
          const browserLocation = await getLocationFromBrowser();
          setLocation(browserLocation);
        } catch (err) {
          // If browser geolocation fails, fall back to IP-based location
          console.log('Browser geolocation failed, falling back to IP-based location');
          const ipLocation = await getLocationFromIP();
          setLocation(ipLocation);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initializeLocation();
  }, []);

  // Function to manually request location permission again
  const requestLocationPermission = async () => {
    try {
      setLoading(true);
      const browserLocation = await getLocationFromBrowser();
      setLocation(browserLocation);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to manually set a location
  const setManualLocation = (locationData) => {
    setUserSelectedLocation(locationData);
    setLocation(locationData);
  };

  // Get the effective location (user selected or auto-detected)
  const effectiveLocation = userSelectedLocation || location;

  return (
    <LocationContext.Provider
      value={{
        location: effectiveLocation,
        locationPermission,
        loading,
        error,
        requestLocationPermission,
        setManualLocation,
        userSelectedLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export default LocationProvider;