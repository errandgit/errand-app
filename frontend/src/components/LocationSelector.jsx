import React, { useState } from 'react';
import { useLocation } from '../context/LocationContext';
import '../styles/LocationSelector.css';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Cards from '@cloudscape-design/components/cards';

const LocationSelector = ({ onClose }) => {
  const { location, setManualLocation, requestLocationPermission } = useLocation();
  const [searchTerm, setSearchTerm] = useState(location?.city || '');
  const [suggestions, setSuggestions] = useState([]);

  // Sample city suggestions (in a real app, these would come from an API)
  const popularCities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
    'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Francisco',
    'Atlanta', 'Miami', 'Seattle', 'Denver', 'Boston', 'Detroit'
  ];

  const handleSearch = (e) => {
    const term = e.detail.value;
    setSearchTerm(term);
    
    if (term.length > 1) {
      // Filter cities that match the search term
      const matches = popularCities.filter(city => 
        city.toLowerCase().includes(term.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectCity = (city) => {
    setManualLocation({
      city,
      region: '',
      country: '',
      manual: true
    });
    setSearchTerm(city);
    setSuggestions([]);
    if (onClose) onClose();
  };

  const handleUseCurrentLocation = async () => {
    const success = await requestLocationPermission();
    if (success && onClose) {
      onClose();
    }
  };

  return (
    <Container>
      <Box padding="l" backgroundColor="background-container-content">
        <SpaceBetween size="l">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Header variant="h2">Set your location</Header>
            {onClose && (
              <Button
                variant="icon"
                iconName="close"
                onClick={onClose}
                ariaLabel="Close"
              />
            )}
          </Box>
          
          <Box>
            <Input
              type="search"
              placeholder="Search for a city"
              value={searchTerm}
              onChange={handleSearch}
              clearable
            />
          </Box>
          
          {suggestions.length > 0 && (
            <Box backgroundColor="background-hover" borderRadius="default">
              <SpaceBetween size="s">
                {suggestions.map((city, index) => (
                  <Box
                    key={index}
                    padding="s"
                    fontSize="body-m"
                    cursor="pointer"
                    onClick={() => handleSelectCity(city)}
                    display="flex"
                    alignItems="center"
                    _hover={{ backgroundColor: "background-dropdown-item-hover" }}
                  >
                    <Box as="span" fontSize="display-s" marginRight="s">📍</Box>
                    <Box as="span">{city}</Box>
                  </Box>
                ))}
              </SpaceBetween>
            </Box>
          )}
          
          <SpaceBetween size="l">
            <Button
              iconName="location"
              onClick={handleUseCurrentLocation}
              fullWidth
            >
              Use my current location
            </Button>
            
            <Box>
              <Header variant="h3">Popular cities</Header>
              <Grid
                gridDefinition={[
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 },
                  { colspan: 6 }
                ]}
              >
                {popularCities.slice(0, 8).map((city, index) => (
                  <Box 
                    key={index}
                    padding="s"
                    fontSize="body-m"
                    textAlign="center"
                    borderRadius="default"
                    backgroundColor="background-container-header"
                    onClick={() => handleSelectCity(city)}
                    cursor="pointer"
                    margin="xs"
                    _hover={{ backgroundColor: "background-dropdown-item-hover" }}
                  >
                    {city}
                  </Box>
                ))}
              </Grid>
            </Box>
          </SpaceBetween>
        </SpaceBetween>
      </Box>
    </Container>
  );
};

export default LocationSelector;