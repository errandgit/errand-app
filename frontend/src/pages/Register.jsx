import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import SpaceBetween from '@cloudscape-design/components/space-between';
import FormField from '@cloudscape-design/components/form-field';
import Input from '@cloudscape-design/components/input';
import Button from '@cloudscape-design/components/button';
import Header from '@cloudscape-design/components/header';
import Alert from '@cloudscape-design/components/alert';
import Checkbox from '@cloudscape-design/components/checkbox';
import Grid from '@cloudscape-design/components/grid';
import Tiles from '@cloudscape-design/components/tiles';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { firstName, lastName, email, password, confirmPassword, role } = formData;

  const onChange = (e, field) => {
    setFormData({ ...formData, [field]: e.detail.value });
  };
  
  const [termsAccepted, setTermsAccepted] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Password validation
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    // In a real app, this would make an API request
    // For demo purposes, we'll simulate registration
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: '123',
        name: `${firstName} ${lastName}`,
        email,
        role
      }));
      
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <Box padding="xxl">
      <Container>
        <Box margin={{ horizontal: "auto" }} padding="l" maxWidth="700px">
          <SpaceBetween size="l">
            <div>
              <Header variant="h1">Create an account</Header>
              <Box variant="p" color="text-body-secondary">Join our community of service providers and clients</Box>
            </div>
            
            {error && (
              <Alert type="error">
                {error}
              </Alert>
            )}
            
            <form onSubmit={onSubmit}>
              <SpaceBetween size="l">
                <Grid
                  gridDefinition={[
                    { colspan: { default: 12, xs: 6 } },
                    { colspan: { default: 12, xs: 6 } }
                  ]}
                >
                  <FormField
                    label="First Name"
                    constraintText="Enter your first name"
                  >
                    <Input
                      value={firstName}
                      onChange={e => onChange(e, 'firstName')}
                      placeholder="Enter your first name"
                    />
                  </FormField>
                  
                  <FormField
                    label="Last Name"
                    constraintText="Enter your last name"
                  >
                    <Input
                      value={lastName}
                      onChange={e => onChange(e, 'lastName')}
                      placeholder="Enter your last name"
                    />
                  </FormField>
                </Grid>
                
                <FormField
                  label="Email"
                  constraintText="Please enter a valid email address"
                >
                  <Input
                    type="email"
                    value={email}
                    onChange={e => onChange(e, 'email')}
                    placeholder="Enter your email"
                  />
                </FormField>
                
                <FormField
                  label="Password"
                  constraintText="Password must be at least 6 characters"
                >
                  <Input
                    type="password"
                    value={password}
                    onChange={e => onChange(e, 'password')}
                    placeholder="Create a password"
                  />
                </FormField>
                
                <FormField
                  label="Confirm Password"
                >
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={e => onChange(e, 'confirmPassword')}
                    placeholder="Confirm your password"
                  />
                </FormField>
                
                <FormField
                  label="I want to join as"
                  stretch
                >
                  <Tiles
                    value={role}
                    onChange={({ detail }) => setFormData({ ...formData, role: detail.value })}
                    items={[
                      {
                        value: "client",
                        label: "Client",
                        description: "I need services",
                        image: <Box fontSize="display-l" textAlign="center">👤</Box>
                      },
                      {
                        value: "provider",
                        label: "Provider",
                        description: "I offer services",
                        image: <Box fontSize="display-l" textAlign="center">🔧</Box>
                      }
                    ]}
                  />
                </FormField>
                
                <Box>
                  <Checkbox
                    checked={termsAccepted}
                    onChange={event => setTermsAccepted(event.detail.checked)}
                  >
                    I agree to the{' '}
                    <Link to="/terms" style={{ color: 'var(--color-text-accent)' }}>Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" style={{ color: 'var(--color-text-accent)' }}>Privacy Policy</Link>
                  </Checkbox>
                </Box>
                
                <Button
                  variant="primary"
                  formAction="submit"
                  loading={loading}
                  disabled={!termsAccepted}
                  fullWidth
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </SpaceBetween>
            </form>
            
            <Box textAlign="center">
              <Box variant="p">
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--color-text-accent)', textDecoration: 'none' }}>
                  Sign in
                </Link>
              </Box>
            </Box>
          </SpaceBetween>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;