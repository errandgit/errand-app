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
import ContentLayout from '@cloudscape-design/components/content-layout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import Icon from '@cloudscape-design/components/icon';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e, field) => {
    setFormData({ ...formData, [field]: e.detail.value });
  };
  
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // In a real app, this would make an API request
    // For demo purposes, we'll simulate a login
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'demo@example.com' && password === 'password') {
        // Store user in localStorage
        localStorage.setItem('user', JSON.stringify({
          id: '123',
          name: 'Demo User',
          firstName: 'Demo',
          lastName: 'User',
          email,
          role: 'client'
        }));
        
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <BreadcrumbGroup
            items={[
              { text: "Home", href: "/" },
              { text: "Sign In", href: "/login" },
            ]}
          />
        </SpaceBetween>
      }
    >
      <ColumnLayout columns={2}>
        {/* Left Column - Login Form */}
        <Container>
          <Box padding="l">
            <SpaceBetween size="l">
              <div>
                <Header variant="h1">Welcome back</Header>
                <Box variant="p" color="text-body-secondary">
                  Sign in to your Errand account to continue
                </Box>
              </div>
              
              {error && (
                <Alert type="error" dismissible onDismiss={() => setError('')}>
                  {error}
                </Alert>
              )}
              
              <form onSubmit={onSubmit}>
                <SpaceBetween size="l">
                  <FormField
                    label="Email address"
                    constraintText="Enter the email address associated with your account"
                  >
                    <Input
                      type="email"
                      value={email}
                      onChange={e => onChange(e, 'email')}
                      placeholder="Enter your email"
                      invalid={error && !email}
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
                      placeholder="Enter your password"
                      invalid={error && !password}
                    />
                  </FormField>
                  
                  <SpaceBetween direction="horizontal" size="xl" alignItems="center">
                    <Checkbox
                      checked={rememberMe}
                      onChange={event => setRememberMe(event.detail.checked)}
                    >
                      Keep me signed in
                    </Checkbox>
                    <Link to="/forgot-password" style={{ color: 'var(--color-text-accent)', textDecoration: 'none' }}>
                      Forgot password?
                    </Link>
                  </SpaceBetween>
                  
                  <Button
                    variant="primary"
                    formAction="submit"
                    loading={loading}
                    fullWidth
                    iconName="unlocked"
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </SpaceBetween>
              </form>
              
              <Box textAlign="center">
                <Box variant="p">
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: 'var(--color-text-accent)', textDecoration: 'none', fontWeight: 'bold' }}>
                    Create account
                  </Link>
                </Box>
              </Box>
            </SpaceBetween>
          </Box>
        </Container>

        {/* Right Column - Info & Demo */}
        <SpaceBetween size="l">
          <Container
            header={
              <Header variant="h2" description="Quick access for testing">
                Demo Account
              </Header>
            }
          >
            <Box padding="l">
              <SpaceBetween size="m">
                <Box
                  padding="m"
                  borderRadius="default"
                  backgroundColor="background-container-header"
                >
                  <SpaceBetween size="xs">
                    <Box variant="strong">Demo Credentials:</Box>
                    <Box variant="p">Email: demo@example.com</Box>
                    <Box variant="p">Password: password</Box>
                  </SpaceBetween>
                </Box>
                <Button
                  fullWidth
                  onClick={() => {
                    setFormData({ email: 'demo@example.com', password: 'password' });
                  }}
                >
                  Use Demo Account
                </Button>
              </SpaceBetween>
            </Box>
          </Container>

          <Container
            header={
              <Header variant="h2">Why Choose Errand?</Header>
            }
          >
            <Box padding="l">
              <SpaceBetween size="m">
                <SpaceBetween direction="horizontal" size="s" alignItems="center">
                  <Icon name="status-positive" size="medium" />
                  <div>
                    <Box variant="strong">Verified Professionals</Box>
                    <Box variant="p" color="text-body-secondary">
                      All service providers are background-checked and verified
                    </Box>
                  </div>
                </SpaceBetween>
                
                <SpaceBetween direction="horizontal" size="s" alignItems="center">
                  <Icon name="security" size="medium" />
                  <div>
                    <Box variant="strong">Secure Payments</Box>
                    <Box variant="p" color="text-body-secondary">
                      Safe and secure payment processing with buyer protection
                    </Box>
                  </div>
                </SpaceBetween>
                
                <SpaceBetween direction="horizontal" size="s" alignItems="center">
                  <Icon name="contact" size="medium" />
                  <div>
                    <Box variant="strong">24/7 Support</Box>
                    <Box variant="p" color="text-body-secondary">
                      Round-the-clock customer support for peace of mind
                    </Box>
                  </div>
                </SpaceBetween>
                
                <SpaceBetween direction="horizontal" size="s" alignItems="center">
                  <Icon name="thumbs-up" size="medium" />
                  <div>
                    <Box variant="strong">Satisfaction Guarantee</Box>
                    <Box variant="p" color="text-body-secondary">
                      100% satisfaction guarantee on all completed services
                    </Box>
                  </div>
                </SpaceBetween>
              </SpaceBetween>
            </Box>
          </Container>
        </SpaceBetween>
      </ColumnLayout>
    </ContentLayout>
  );
};

export default Login;