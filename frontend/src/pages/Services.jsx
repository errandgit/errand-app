import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from '../context/LocationContext';
import Container from '@cloudscape-design/components/container';
import Box from '@cloudscape-design/components/box';
import Header from '@cloudscape-design/components/header';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Cards from '@cloudscape-design/components/cards';
import Button from '@cloudscape-design/components/button';
import Badge from '@cloudscape-design/components/badge';
import Spinner from '@cloudscape-design/components/spinner';
import Alert from '@cloudscape-design/components/alert';
import Input from '@cloudscape-design/components/input';
import Select from '@cloudscape-design/components/select';
import Toggle from '@cloudscape-design/components/toggle';
import ColumnLayout from '@cloudscape-design/components/column-layout';
import StatusIndicator from '@cloudscape-design/components/status-indicator';
import Icon from '@cloudscape-design/components/icon';
import ContentLayout from '@cloudscape-design/components/content-layout';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import Pagination from '@cloudscape-design/components/pagination';
import Table from '@cloudscape-design/components/table';
import Tabs from '@cloudscape-design/components/tabs';
import KeyValuePairs from '@cloudscape-design/components/key-value-pairs';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState({ label: 'Most Popular', value: 'popular' });
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('cards');
  const [itemsPerPage] = useState(12);
  const { location } = useLocation();

  const categories = [
    { id: 'all', name: 'All Services', icon: 'search', count: 8456, description: 'Browse all available services' },
    { id: 'home_improvement', name: 'Home & Garden', icon: 'home', count: 2341, description: 'Home repairs and improvements' },
    { id: 'cleaning', name: 'Cleaning Services', icon: 'status-positive', count: 1876, description: 'Professional cleaning services' },
    { id: 'moving', name: 'Moving & Delivery', icon: 'share', count: 945, description: 'Moving and delivery services' },
    { id: 'errands', name: 'Personal Services', icon: 'shopping-cart', count: 1234, description: 'Personal assistance and errands' },
    { id: 'tech', name: 'Technology', icon: 'settings', count: 654, description: 'Tech support and services' },
  ];

  const sortOptions = [
    { label: 'Most Popular', value: 'popular' },
    { label: 'Highest Rated', value: 'rating' },
    { label: 'Lowest Price', value: 'price_low' },
    { label: 'Newest', value: 'newest' },
    { label: 'Available Now', value: 'available' }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const demoServices = [
          {
            _id: '101',
            title: 'Professional House Cleaning',
            description: 'Complete house cleaning service including kitchen, bathrooms, bedrooms, and living areas. Eco-friendly products available.',
            category: 'cleaning',
            provider: { 
              firstName: 'Maria', 
              lastName: 'Rodriguez',
              rating: 4.9,
              completedJobs: 234,
              responseTime: '< 1 hour'
            },
            pricing: { type: 'fixed', amount: 120, currency: 'USD' },
            rating: { average: 4.8, count: 124 },
            availability: 'Available today',
            verified: true,
            featured: true,
            location: 'Downtown Area',
            tags: ['Eco-friendly', 'Insured', 'Background checked'],
            lastActive: '2 hours ago'
          },
          {
            _id: '102',
            title: 'Expert Handyman Services',
            description: 'General repairs, fixture installations, furniture assembly, painting, and home maintenance tasks.',
            category: 'home_improvement',
            provider: { 
              firstName: 'John', 
              lastName: 'Smith',
              rating: 4.7,
              completedJobs: 189,
              responseTime: '< 2 hours'
            },
            pricing: { type: 'hourly', amount: 65, currency: 'USD' },
            rating: { average: 4.6, count: 89 },
            availability: 'Available tomorrow',
            verified: true,
            featured: false,
            location: 'Citywide',
            tags: ['Licensed', 'Insured', '10+ years experience'],
            lastActive: '1 hour ago'
          },
          {
            _id: '103',
            title: 'Professional Moving Service',
            description: 'Full-service moving for apartments and houses. Packing, loading, transport, and unpacking available.',
            category: 'moving',
            provider: { 
              firstName: 'Mike', 
              lastName: 'Johnson',
              rating: 4.8,
              completedJobs: 156,
              responseTime: '< 30 minutes'
            },
            pricing: { type: 'hourly', amount: 85, currency: 'USD' },
            rating: { average: 4.7, count: 67 },
            availability: 'Available this week',
            verified: true,
            featured: true,
            location: 'Metro Area',
            tags: ['Fully insured', 'Equipment provided', 'Same-day service'],
            lastActive: '30 minutes ago'
          }
        ];
        
        setServices(demoServices);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [activeCategory, sortBy, showAvailableOnly]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentPage(1);
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = activeCategory === 'all' || service.category === activeCategory;
    const matchesSearch = !searchQuery || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailability = !showAvailableOnly || service.availability.includes('Available');
    
    return matchesCategory && matchesSearch && matchesAvailability;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  const tableColumns = [
    {
      id: 'service',
      header: 'Service',
      cell: item => (
        <SpaceBetween size="xs">
          <Box variant="strong">{item.title}</Box>
          <Box variant="small" color="text-body-secondary">
            by {item.provider.firstName} {item.provider.lastName}
          </Box>
        </SpaceBetween>
      ),
      sortingField: 'title'
    },
    {
      id: 'category',
      header: 'Category',
      cell: item => (
        <Badge color="blue">
          {categories.find(cat => cat.id === item.category)?.name || item.category}
        </Badge>
      )
    },
    {
      id: 'rating',
      header: 'Rating',
      cell: item => (
        <SpaceBetween direction="horizontal" size="xs" alignItems="center">
          <StatusIndicator type="success">★ {item.rating.average}</StatusIndicator>
          <Box variant="small">({item.rating.count})</Box>
        </SpaceBetween>
      ),
      sortingField: 'rating.average'
    },
    {
      id: 'price',
      header: 'Price',
      cell: item => (
        <Box variant="strong" color="text-status-info">
          ${item.pricing.amount}{item.pricing.type === 'hourly' ? '/hr' : ''}
        </Box>
      ),
      sortingField: 'pricing.amount'
    },
    {
      id: 'availability',
      header: 'Availability',
      cell: item => (
        <StatusIndicator type="success">{item.availability}</StatusIndicator>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: item => (
        <SpaceBetween direction="horizontal" size="xs">
          <Button size="small" onClick={() => window.location.href = `/services/${item._id}`}>
            View Details
          </Button>
          <Button size="small" iconName="heart" ariaLabel="Add to favorites" />
        </SpaceBetween>
      )
    }
  ];

  return (
    <ContentLayout
      header={
        <SpaceBetween size="m">
          <BreadcrumbGroup
            items={[
              { text: "Errand Console", href: "/" },
              { text: "Services", href: "/services" },
            ]}
          />
          <Header
            variant="h1"
            description={`Professional services marketplace ${location?.city ? `in ${location.city}` : 'in your area'}`}
            counter={`(${filteredServices.length})`}
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button iconName="refresh" onClick={() => window.location.reload()}>
                  Refresh
                </Button>
                <Button variant="primary" iconName="add-plus" href="/pro/register">
                  List Your Service
                </Button>
              </SpaceBetween>
            }
          >
            Services
          </Header>
        </SpaceBetween>
      }
    >
      <SpaceBetween size="l">
        {/* Filters and Controls */}
        <Container
          header={
            <Header variant="h2" description="Filter and search services">
              Search & Filters
            </Header>
          }
        >
          <SpaceBetween size="m">
            <ColumnLayout columns={4}>
              <div>
                <Box variant="awsui-key-label">Search Services</Box>
                <Input
                  placeholder="Search services or providers..."
                  value={searchQuery}
                  onChange={({ detail }) => setSearchQuery(detail.value)}
                  type="search"
                  clearAriaLabel="Clear search"
                />
              </div>
              <div>
                <Box variant="awsui-key-label">Sort By</Box>
                <Select
                  selectedOption={sortBy}
                  onChange={({ detail }) => setSortBy(detail.selectedOption)}
                  options={sortOptions}
                />
              </div>
              <div>
                <Box variant="awsui-key-label">View Mode</Box>
                <SpaceBetween direction="horizontal" size="xs">
                  <Button
                    variant={viewMode === 'cards' ? 'primary' : 'normal'}
                    iconName="view-full"
                    onClick={() => setViewMode('cards')}
                  >
                    Cards
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'primary' : 'normal'}
                    iconName="table"
                    onClick={() => setViewMode('table')}
                  >
                    Table
                  </Button>
                </SpaceBetween>
              </div>
              <div>
                <Box variant="awsui-key-label">Filters</Box>
                <Toggle
                  checked={showAvailableOnly}
                  onChange={({ detail }) => setShowAvailableOnly(detail.checked)}
                >
                  Available now only
                </Toggle>
              </div>
            </ColumnLayout>
          </SpaceBetween>
        </Container>

        {/* Categories */}
        <Container
          header={
            <Header variant="h2" counter={`(${categories.length})`}>
              Categories
            </Header>
          }
        >
          <Cards
            items={categories}
            cardDefinition={{
              header: item => (
                <SpaceBetween direction="horizontal" size="s" alignItems="center">
                  <Icon name={item.icon} size="medium" />
                  <Box variant="h3">{item.name}</Box>
                  {activeCategory === item.id && <Badge color="green">Active</Badge>}
                </SpaceBetween>
              ),
              sections: [
                {
                  id: "details",
                  content: item => (
                    <SpaceBetween size="s">
                      <Box variant="p" color="text-body-secondary">
                        {item.description}
                      </Box>
                      <Box variant="small" color="text-body-secondary">
                        {item.count.toLocaleString()} services available
                      </Box>
                      <Button
                        fullWidth
                        variant={activeCategory === item.id ? 'primary' : 'normal'}
                        onClick={() => handleCategoryChange(item.id)}
                      >
                        {activeCategory === item.id ? 'Selected' : 'Select Category'}
                      </Button>
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

        {/* Services Content */}
        <Container
          header={
            <Header
              variant="h2"
              counter={`(${filteredServices.length})`}
              description="Browse and book professional services"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button iconName="download">Export</Button>
                  <Button iconName="settings">Preferences</Button>
                </SpaceBetween>
              }
            >
              Available Services
            </Header>
          }
        >
          {loading ? (
            <Box textAlign="center" padding="xxl">
              <SpaceBetween size="m" alignItems="center">
                <Spinner size="large" />
                <Box variant="p">Loading services...</Box>
              </SpaceBetween>
            </Box>
          ) : error ? (
            <Alert type="error" header="Error loading services" dismissible>
              {error}
            </Alert>
          ) : filteredServices.length === 0 ? (
            <Box textAlign="center" padding="xxl">
              <SpaceBetween size="m">
                <Icon name="search" size="large" />
                <Box variant="h3">No services found</Box>
                <Box variant="p" color="text-body-secondary">
                  Try adjusting your search criteria or browse different categories.
                </Box>
                <Button onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setShowAvailableOnly(false);
                }}>
                  Clear All Filters
                </Button>
              </SpaceBetween>
            </Box>
          ) : (
            <SpaceBetween size="l">
              <Tabs
                tabs={[
                  {
                    label: `${viewMode === 'cards' ? 'Card' : 'Table'} View`,
                    id: "services-view",
                    content: viewMode === 'cards' ? (
                      <Cards
                        items={paginatedServices}
                        cardDefinition={{
                          header: item => (
                            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                              <Box
                                padding="s" 
                                fontSize="heading-xl"
                                textAlign="center"
                                color="text-body-secondary"
                                backgroundColor="background-container-header"
                                borderRadius="default"
                                width="60px"
                                height="60px"
                              >
                                <Icon name="file" size="medium" />
                              </Box>
                              <div style={{ flex: 1 }}>
                                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                  {item.featured && <Badge color="red">Featured</Badge>}
                                  {item.verified && <Badge color="green">Verified</Badge>}
                                </SpaceBetween>
                              </div>
                            </SpaceBetween>
                          ),
                          sections: [
                            {
                              id: "main",
                              content: item => (
                                <SpaceBetween size="m">
                                  <div>
                                    <Box variant="h3">{item.title}</Box>
                                    <Box variant="small" color="text-body-secondary">
                                      by {item.provider.firstName} {item.provider.lastName}
                                    </Box>
                                  </div>
                                  
                                  <Box variant="p" color="text-body-secondary">
                                    {item.description}
                                  </Box>
                                  
                                  <KeyValuePairs
                                    columns={2}
                                    items={[
                                      {
                                        label: "Rating",
                                        value: (
                                          <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                            <StatusIndicator type="success">★ {item.rating.average}</StatusIndicator>
                                            <Box variant="small">({item.rating.count})</Box>
                                          </SpaceBetween>
                                        )
                                      },
                                      {
                                        label: "Response Time",
                                        value: <Box variant="small" color="text-status-success">{item.provider.responseTime}</Box>
                                      },
                                      {
                                        label: "Completed Jobs",
                                        value: <Box variant="small">{item.provider.completedJobs}</Box>
                                      },
                                      {
                                        label: "Last Active",
                                        value: <Box variant="small" color="text-body-secondary">{item.lastActive}</Box>
                                      }
                                    ]}
                                  />
                                  
                                  <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                    <Icon name="status-positive" size="small" />
                                    <Box variant="small" color="text-status-success">{item.availability}</Box>
                                    <Box variant="small" color="text-body-secondary">• {item.location}</Box>
                                  </SpaceBetween>
                                  
                                  <SpaceBetween direction="horizontal" size="xs">
                                    {item.tags.slice(0, 2).map((tag, index) => (
                                      <Badge key={index} color="blue">{tag}</Badge>
                                    ))}
                                  </SpaceBetween>
                                  
                                  <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                    <Box variant="strong" color="text-status-info" fontSize="heading-s">
                                      ${item.pricing.amount}{item.pricing.type === 'hourly' ? '/hr' : ''}
                                    </Box>
                                    <div style={{ flex: 1 }} />
                                    <SpaceBetween direction="horizontal" size="xs">
                                      <Button
                                        variant="normal"
                                        iconName="heart"
                                        ariaLabel="Add to favorites"
                                      />
                                      <Button
                                        variant="primary"
                                        onClick={() => window.location.href = `/services/${item._id}`}
                                      >
                                        View Details
                                      </Button>
                                    </SpaceBetween>
                                  </SpaceBetween>
                                </SpaceBetween>
                              )
                            }
                          ]
                        }}
                        cardsPerRow={[
                          { cards: 1, breakpoint: 'xs' },
                          { cards: 2, breakpoint: 's' },
                          { cards: 2, breakpoint: 'm' },
                          { cards: 3, breakpoint: 'l' }
                        ]}
                        variant="full-page"
                      />
                    ) : (
                      <Table
                        items={paginatedServices}
                        columnDefinitions={tableColumns}
                        variant="embedded"
                        sortingDisabled={false}
                        empty={
                          <Box textAlign="center" color="inherit">
                            <b>No services</b>
                            <Box variant="p" color="inherit">
                              No services to display.
                            </Box>
                          </Box>
                        }
                      />
                    )
                  }
                ]}
              />
              
              {totalPages > 1 && (
                <Box textAlign="center">
                  <Pagination
                    currentPageIndex={currentPage}
                    pagesCount={totalPages}
                    onChange={({ detail }) => setCurrentPage(detail.currentPageIndex)}
                  />
                </Box>
              )}
            </SpaceBetween>
          )}
        </Container>
      </SpaceBetween>
    </ContentLayout>
  );
};

export default Services;
