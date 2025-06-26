import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Grid from '@cloudscape-design/components/grid';
import Button from '@cloudscape-design/components/button';
import Badge from '@cloudscape-design/components/badge';
import Table from '@cloudscape-design/components/table';
import Tabs from '@cloudscape-design/components/tabs';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Alert from '@cloudscape-design/components/alert';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    // Simulating fetching user data
    const fetchUserData = () => {
      const userData = {
        firstName: 'Demo',
        lastName: 'User',
        email: 'demo@example.com',
        role: 'client',
        profileImage: '',
        phone: '(555) 123-4567',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        createdAt: new Date('2024-01-15')
      };
      
      setUser(userData);
      setEditData(userData);
      
      // Simulate fetching bookings
      const demoBookings = [
        {
          _id: 'b1',
          service: {
            _id: '101',
            title: 'Professional House Cleaning'
          },
          provider: {
            firstName: 'Service',
            lastName: 'Provider'
          },
          scheduledDate: new Date('2025-07-15T10:00:00'),
          status: 'confirmed',
          price: {
            amount: 120,
            currency: 'USD'
          }
        },
        {
          _id: 'b2',
          service: {
            _id: '102',
            title: 'Handyman Services'
          },
          provider: {
            firstName: 'Handy',
            lastName: 'Person'
          },
          scheduledDate: new Date('2025-07-20T14:00:00'),
          status: 'pending',
          price: {
            amount: 85,
            currency: 'USD'
          }
        }
      ];
      
      setBookings(demoBookings);
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
    if (editMode) {
      // Save changes
      setUser(editData);
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: { color: 'green', text: 'Confirmed' },
      pending: { color: 'blue', text: 'Pending' },
      completed: { color: 'grey', text: 'Completed' },
      cancelled: { color: 'red', text: 'Cancelled' }
    };
    
    const config = statusConfig[status] || { color: 'grey', text: status };
    return <Badge color={config.color}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <Box padding="xxl" textAlign="center">
        <SpaceBetween size="m">
          <Box variant="h2">Loading profile...</Box>
        </SpaceBetween>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box padding="xxl">
        <Alert type="info" header="Please log in">
          You need to be logged in to view your profile.{' '}
          <Link to="/login">Sign in here</Link>
        </Alert>
      </Box>
    );
  }

  const bookingColumns = [
    {
      id: 'service',
      header: 'Service',
      cell: item => item.service.title
    },
    {
      id: 'provider',
      header: 'Provider',
      cell: item => `${item.provider.firstName} ${item.provider.lastName}`
    },
    {
      id: 'date',
      header: 'Scheduled Date',
      cell: item => item.scheduledDate.toLocaleDateString()
    },
    {
      id: 'status',
      header: 'Status',
      cell: item => getStatusBadge(item.status)
    },
    {
      id: 'price',
      header: 'Price',
      cell: item => `$${item.price.amount}`
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: item => (
        <SpaceBetween direction="horizontal" size="xs">
          <Button size="small" href={`/services/${item.service._id}`}>
            View Service
          </Button>
          {item.status === 'pending' && (
            <Button size="small" variant="link">
              Cancel
            </Button>
          )}
        </SpaceBetween>
      )
    }
  ];

  return (
    <Box padding="xxl">
      <Container>
        <SpaceBetween size="l">
          {/* Profile Header */}
          <Box>
            <Grid
              gridDefinition={[
                { colspan: { default: 12, s: 8 } },
                { colspan: { default: 12, s: 4 } }
              ]}
            >
              <SpaceBetween size="m">
                <Header variant="h1">
                  {user.firstName} {user.lastName}
                </Header>
                <SpaceBetween direction="horizontal" size="s">
                  <Badge color="blue">{user.role}</Badge>
                  <Box variant="small" color="text-body-secondary">
                    Member since {user.createdAt.toLocaleDateString()}
                  </Box>
                </SpaceBetween>
              </SpaceBetween>
              <Box textAlign="right">
                <Button
                  variant={editMode ? "primary" : "normal"}
                  onClick={handleEditToggle}
                >
                  {editMode ? 'Save Changes' : 'Edit Profile'}
                </Button>
              </Box>
            </Grid>
          </Box>

          {/* Profile Content */}
          <Tabs
            tabs={[
              {
                label: "My Bookings",
                id: "bookings",
                content: (
                  <Container>
                    <SpaceBetween size="l">
                      <Header variant="h2">Your Bookings</Header>
                      {bookings.length === 0 ? (
                        <Box textAlign="center" padding="l">
                          <SpaceBetween size="m">
                            <Box variant="h3">No bookings yet</Box>
                            <Box variant="p" color="text-body-secondary">
                              Start by browsing our services
                            </Box>
                            <Button variant="primary" href="/services">
                              Browse Services
                            </Button>
                          </SpaceBetween>
                        </Box>
                      ) : (
                        <Table
                          items={bookings}
                          columnDefinitions={bookingColumns}
                          variant="embedded"
                        />
                      )}
                    </SpaceBetween>
                  </Container>
                )
              },
              {
                label: "Personal Information",
                id: "personal",
                content: (
                  <Container>
                    <SpaceBetween size="l">
                      <Header variant="h2">Personal Information</Header>
                      <Grid
                        gridDefinition={[
                          { colspan: { default: 12, s: 6 } },
                          { colspan: { default: 12, s: 6 } }
                        ]}
                      >
                        <FormField label="First Name">
                          {editMode ? (
                            <Input
                              value={editData.firstName}
                              onChange={({ detail }) => handleInputChange('firstName', detail.value)}
                            />
                          ) : (
                            <Box variant="p">{user.firstName}</Box>
                          )}
                        </FormField>
                        <FormField label="Last Name">
                          {editMode ? (
                            <Input
                              value={editData.lastName}
                              onChange={({ detail }) => handleInputChange('lastName', detail.value)}
                            />
                          ) : (
                            <Box variant="p">{user.lastName}</Box>
                          )}
                        </FormField>
                      </Grid>
                      <FormField label="Email">
                        {editMode ? (
                          <Input
                            type="email"
                            value={editData.email}
                            onChange={({ detail }) => handleInputChange('email', detail.value)}
                          />
                        ) : (
                          <Box variant="p">{user.email}</Box>
                        )}
                      </FormField>
                      <FormField label="Phone">
                        {editMode ? (
                          <Input
                            value={editData.phone}
                            onChange={({ detail }) => handleInputChange('phone', detail.value)}
                          />
                        ) : (
                          <Box variant="p">{user.phone}</Box>
                        )}
                      </FormField>
                    </SpaceBetween>
                  </Container>
                )
              },
              {
                label: "Settings",
                id: "settings",
                content: (
                  <Container>
                    <SpaceBetween size="l">
                      <Header variant="h2">Account Settings</Header>
                      <SpaceBetween size="m">
                        <Button variant="normal">Change Password</Button>
                        <Button variant="normal">Notification Preferences</Button>
                        <Button variant="normal">Privacy Settings</Button>
                        <Button variant="normal">Payment Methods</Button>
                      </SpaceBetween>
                      <Box padding={{ top: "l" }}>
                        <Button variant="normal">Delete Account</Button>
                      </Box>
                    </SpaceBetween>
                  </Container>
                )
              }
            ]}
          />
        </SpaceBetween>
      </Container>
    </Box>
  );
};

export default Profile;
