import React from 'react';
import { Link } from 'react-router-dom';
import HomeLogo from '../components/HomeLogo';
import { useLocation } from '../context/LocationContext';

import Grid from '@cloudscape-design/components/grid';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';
import Header from '@cloudscape-design/components/header';
import Cards from '@cloudscape-design/components/cards';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Button from '@cloudscape-design/components/button';
import Input from '@cloudscape-design/components/input';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Badge from '@cloudscape-design/components/badge';
import Icon from '@cloudscape-design/components/icon';
import ContentLayout from '@cloudscape-design/components/content-layout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';
import ProgressBar from '@cloudscape-design/components/progress-bar';
import Link as CloudscapeLink from '@cloudscape-design/components/link';
import TextContent from '@cloudscape-design/components/text-content';

const Home = () => {
  const { location } = useLocation();
  
  const dashboardMetrics = [
    { 
      label: 'Active Services', 
      value: '12,543',
      info: 'Available now',
      type: 'success',
      trend: '+12% from last month'
    },
    { 
      label: 'Completed Tasks', 
      value: '89,234',
      info: 'This month',
      type: 'success',
      trend: '+8% from last month'
    },
    { 
      label: 'Customer Rating', 
      value: '4.8/5',
      info: 'Average rating',
      type: 'success',
      trend: '+0.2 from last month'
    },
    { 
      label: 'Response Time', 
      value: '< 2 hours',
      info: 'Average',
      type: 'success',
      trend: '-15% improvement'
    },
  ];

  const serviceCategories = [
    { 
      name: 'Home & Garden', 
      icon: 'home', 
      count: '2,341 services',
      description: 'Home improvement, repairs, and gardening',
      status: 'Available',
      growth: '+15%'
    },
    { 
      name: 'Cleaning Services', 
      icon: 'status-positive', 
      count: '1,876 services',
      description: 'Professional cleaning and maintenance',
      status: 'Available',
      growth: '+8%'
    },
    { 
      name: 'Moving & Delivery', 
      icon: 'share', 
      count: '945 services',
      description: 'Moving assistance and delivery services',
      status: 'Available',
      growth: '+22%'
    },
    { 
      name: 'Personal Services', 
      icon: 'user-profile', 
      count: '1,234 services',
      description: 'Personal assistance and errands',
      status: 'Available',
      growth: '+5%'
    },
  ];

  const featuredProviders = [
    {
      id: 106,
      name: 'Sarah Johnson',
      service: 'Professional Cleaning',
      rating: 4.9,
      reviews: 124,
      responseTime: '< 1 hour',
      completedJobs: 234,
      verified: true,
      topRated: true,
      availability: 'Available today'
    },
    {
      id: 109,
      name: 'Mike Chen',
      service: 'Home Repairs',
      rating: 4.8,
      reviews: 89,
      responseTime: '< 2 hours',
      completedJobs: 156,
      verified: true,
      topRated: false,
      availability: 'Available now'
    },
    {
      id: 104,
      name: 'David Wilson',
      service: 'Moving Services',
      rating: 4.7,
      reviews: 67,
      responseTime: '< 30 min',
      completedJobs: 98,
      verified: true,
      topRated: true,
      availability: 'Available tomorrow'
    },
  ];

  const [searchQuery, setSearchQuery] = React.useState('');
  
  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <BreadcrumbGroup
            items={[
              { text: "Errand Console", href: "/" },
              { text: "Dashboard", href: "/" },
            ]}
          />
          <Header
            variant="h1"
            info={<CloudscapeLink variant="info">Info</CloudscapeLink>}
            description="Monitor your service marketplace activity and manage your tasks"
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button iconName="refresh">Refresh</Button>
                <Button variant="primary" iconName="add-plus">
                  Create new task
                </Button>
              </SpaceBetween>
            }
          >
            Service Dashboard
          </Header>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="l">
        {/* Dashboard Overview */}
        <Container
          header={
            <Header
              variant="h2"
              description="Real-time metrics and performance indicators"
              actions={
                <Button iconName="external" iconAlign="right">
                  View detailed analytics
                </Button>
              }
            >
              Overview
            </Header>
          }
        >
          <ColumnLayout columns={4} variant="text-grid">
            {dashboardMetrics.map((metric, index) => (
              <div key={index}>
                <Box variant="awsui-key-label">{metric.label}</Box>
                <Box variant="h2" color="text-label" padding={{ bottom: "xs" }}>
                  {metric.value}
                </Box>
                <Box variant="small" color="text-body-secondary" padding={{ bottom: "xs" }}>
                  {metric.info}
                </Box>
                <StatusIndicator type={metric.type}>
                  {metric.trend}
                </StatusIndicator>
              </div>
            ))}
          </ColumnLayout>
        </Container>

        {/* Quick Actions */}
        <Container
          header={
            <Header variant="h2" description="Common tasks and quick access">
              Quick Actions
            </Header>
          }
        >
          <SpaceBetween size="m">
            <Box maxWidth="600px">
              <SpaceBetween direction="horizontal" size="xs">
                <div style={{ flexGrow: 1 }}>
                  <Input
                    placeholder="Search for services, providers, or tasks..."
                    value={searchQuery}
                    onChange={({ detail }) => setSearchQuery(detail.value)}
                    type="search"
                  />
                </div>
                <Button variant="primary" iconName="search">
                  Search
                </Button>
              </SpaceBetween>
            </Box>
            
            <ColumnLayout columns={3}>
              <Button fullWidth iconName="add-plus">
                Post a new task
              </Button>
              <Button fullWidth iconName="search">
                Find services
              </Button>
              <Button fullWidth iconName="user-profile">
                Browse providers
              </Button>
            </ColumnLayout>
          </SpaceBetween>
        </Container>

        {/* Service Categories */}
        <Container
          header={
            <Header
              variant="h2"
              description="Browse services by category"
              counter={`(${serviceCategories.length})`}
              actions={
                <Button href="/services">View all categories</Button>
              }
            >
              Service Categories
            </Header>
          }
        >
          <Cards
            items={serviceCategories}
            cardDefinition={{
              header: item => (
                <SpaceBetween direction="horizontal" size="s" alignItems="center">
                  <Icon name={item.icon} size="medium" />
                  <Box variant="h3">{item.name}</Box>
                </SpaceBetween>
              ),
              sections: [
                {
                  id: "details",
                  content: item => (
                    <SpaceBetween size="m">
                      <Box variant="p" color="text-body-secondary">
                        {item.description}
                      </Box>
                      
                      <KeyValuePairs
                        columns={2}
                        items={[
                          {
                            label: "Available services",
                            value: item.count
                          },
                          {
                            label: "Status",
                            value: <StatusIndicator type="success">{item.status}</StatusIndicator>
                          },
                          {
                            label: "Growth",
                            value: <StatusIndicator type="success">{item.growth}</StatusIndicator>
                          }
                        ]}
                      />
                      
                      <Button
                        fullWidth
                        onClick={() => window.location.href = `/services?category=${item.name.toLowerCase().replace(/\s+/g, '_')}`}
                      >
                        Browse {item.name.toLowerCase()}
                      </Button>
                    </SpaceBetween>
                  )
                }
              ]
            }}
            cardsPerRow={[
              { cards: 1, breakpoint: 'xs' },
              { cards: 2, breakpoint: 's' },
              { cards: 2, breakpoint: 'm' },
              { cards: 2, breakpoint: 'l' }
            ]}
            variant="full-page"
          />
        </Container>

        {/* Featured Providers */}
        <Container
          header={
            <Header
              variant="h2"
              description="Top-rated service providers in your area"
              counter={`(${featuredProviders.length})`}
              actions={
                <Button href="/services">View all providers</Button>
              }
            >
              Featured Providers
            </Header>
          }
        >
          <Cards
            items={featuredProviders}
            cardDefinition={{
              header: item => (
                <SpaceBetween direction="horizontal" size="s" alignItems="center">
                  <Box
                    padding="s"
                    backgroundColor="background-container-header"
                    borderRadius="circle"
                    width="40px"
                    height="40px"
                    textAlign="center"
                    lineHeight="32px"
                    fontSize="body-s"
                    fontWeight="bold"
                  >
                    {item.name.split(' ').map(n => n[0]).join('')}
                  </Box>
                  <div>
                    <Box variant="h3">{item.name}</Box>
                    <Box variant="small" color="text-body-secondary">
                      {item.service}
                    </Box>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    {item.verified && <Badge color="green">Verified</Badge>}
                    {item.topRated && <Badge color="red">Top Rated</Badge>}
                  </div>
                </SpaceBetween>
              ),
              sections: [
                {
                  id: "metrics",
                  content: item => (
                    <SpaceBetween size="m">
                      <ColumnLayout columns={3} variant="text-grid">
                        <div>
                          <Box variant="awsui-key-label">Rating</Box>
                          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                            <StatusIndicator type="success">
                              ★ {item.rating}
                            </StatusIndicator>
                            <Box variant="small">({item.reviews})</Box>
                          </SpaceBetween>
                        </div>
                        <div>
                          <Box variant="awsui-key-label">Response Time</Box>
                          <Box variant="small" color="text-status-success">
                            {item.responseTime}
                          </Box>
                        </div>
                        <div>
                          <Box variant="awsui-key-label">Completed Jobs</Box>
                          <Box variant="small">{item.completedJobs}</Box>
                        </div>
                      </ColumnLayout>
                      
                      <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                        <Icon name="status-positive" size="small" />
                        <Box variant="small" color="text-status-success">
                          {item.availability}
                        </Box>
                      </SpaceBetween>
                      
                      <SpaceBetween direction="horizontal" size="xs">
                        <Button
                          variant="primary"
                          onClick={() => window.location.href = `/services/${item.id}`}
                          fullWidth
                        >
                          View profile
                        </Button>
                        <Button iconName="heart" ariaLabel="Add to favorites" />
                      </SpaceBetween>
                    </SpaceBetween>
                  )
                }
              ]
            }}
            cardsPerRow={[
              { cards: 1, breakpoint: 'xs' },
              { cards: 2, breakpoint: 's' },
              { cards: 3, breakpoint: 'm' },
              { cards: 3, breakpoint: 'l' }
            ]}
            variant="full-page"
          />
        </Container>

        {/* Getting Started */}
        <Container
          header={
            <Header variant="h2" description="Learn how to use the platform effectively">
              Getting Started
            </Header>
          }
        >
          <ColumnLayout columns={4}>
            {[
              {
                step: "1",
                title: "Create your request",
                description: "Describe the task you need completed with detailed requirements",
                icon: "edit",
                action: "Create task"
              },
              {
                step: "2", 
                title: "Review proposals",
                description: "Compare quotes and profiles from qualified service providers",
                icon: "search",
                action: "Browse providers"
              },
              {
                step: "3",
                title: "Select provider",
                description: "Choose the best provider based on ratings, price, and availability",
                icon: "user-profile",
                action: "View ratings"
              },
              {
                step: "4",
                title: "Track progress",
                description: "Monitor task completion and provide feedback upon completion",
                icon: "status-positive",
                action: "View dashboard"
              }
            ].map((step, index) => (
              <Box key={index} padding="l">
                <SpaceBetween size="m">
                  <Box
                    padding="s"
                    backgroundColor="background-container-header"
                    borderRadius="circle"
                    width="40px"
                    height="40px"
                    textAlign="center"
                    lineHeight="32px"
                    fontSize="heading-s"
                    fontWeight="bold"
                    display="inline-block"
                  >
                    {step.step}
                  </Box>
                  <div>
                    <Box variant="h3" padding={{ bottom: "xs" }}>
                      {step.title}
                    </Box>
                    <Box variant="p" color="text-body-secondary" padding={{ bottom: "s" }}>
                      {step.description}
                    </Box>
                    <Button size="small" iconName={step.icon}>
                      {step.action}
                    </Button>
                  </div>
                </SpaceBetween>
              </Box>
            ))}
          </ColumnLayout>
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default Home;