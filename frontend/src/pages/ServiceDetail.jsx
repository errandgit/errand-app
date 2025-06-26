import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        
        // For demonstration purposes, let's simulate an API call
        const response = await fetch(`http://localhost:5000/api/services/${id}`);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        setService(data.data);
      } catch (err) {
        setError('Failed to load service details. Please try again later.');
        console.error('Error fetching service details:', err);
        
        // Fallback demo data in case of error
        setService({
          _id: id,
          title: 'Professional House Cleaning',
          description: 'Complete house cleaning service including kitchen, bathrooms, bedrooms, and living areas. All cleaning supplies and equipment are provided by our professionals. We use eco-friendly products that are safe for children and pets.',
          category: 'cleaning',
          subcategory: 'House Cleaning',
          provider: {
            _id: '2',
            firstName: 'Service',
            lastName: 'Provider',
            profileImage: '',
            bio: 'Professional cleaner with over 5 years of experience. Specializing in deep cleaning and organizing.'
          },
          pricing: {
            type: 'fixed',
            amount: 120,
            currency: 'USD'
          },
          rating: {
            average: 4.8,
            count: 24
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleBooking = () => {
    alert('Booking feature would be implemented here. Selected date: ' + selectedDate);
  };

  if (loading) {
    return <div className="loading-state">Loading service details...</div>;
  }

  if (error) {
    return <div className="error-state">{error}</div>;
  }

  if (!service) {
    return <div className="error-state">Service not found</div>;
  }

  return (
    <div className="service-detail-page">
      <div className="container">
        <div className="service-detail-nav">
          <Link to="/services" className="back-link">
            ← Back to Services
          </Link>
        </div>

        <div className="service-detail-grid">
          <div className="service-detail-main">
            <div className="service-detail-image">
              {/* Replace with actual image when available */}
              <div className="placeholder-image">{service.title} Image</div>
            </div>
            
            <div className="service-detail-content">
              <h1 className="service-detail-title">{service.title}</h1>
              
              <div className="service-meta">
                <div className="service-provider">
                  <div className="provider-avatar"></div>
                  <div className="provider-info">
                    <span className="provider-name">
                      {service.provider.firstName} {service.provider.lastName}
                    </span>
                    <div className="service-rating">
                      <span className="rating-stars">{'★'.repeat(Math.round(service.rating.average))}</span>
                      <span className="rating-number">{service.rating.average} ({service.rating.count} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="service-category">
                  <span className="category-label">Category:</span>
                  <span className="category-value">{service.subcategory || service.category}</span>
                </div>
              </div>

              <div className="service-description">
                <h2>About this service</h2>
                <p>{service.description}</p>
              </div>

              <div className="provider-bio">
                <h2>About the provider</h2>
                <p>{service.provider.bio || 'Professional service provider specializing in quality work and customer satisfaction.'}</p>
              </div>
            </div>
          </div>

          <div className="service-detail-sidebar">
            <div className="booking-card">
              <div className="booking-header">
                <h3>Book this service</h3>
                <div className="booking-price">
                  {service.pricing.type === 'hourly' ? (
                    <span>${service.pricing.amount}/hr</span>
                  ) : (
                    <span>${service.pricing.amount}</span>
                  )}
                </div>
              </div>

              <div className="booking-form">
                <div className="form-group">
                  <label htmlFor="booking-date" className="form-label">Select date</label>
                  <input
                    type="date"
                    id="booking-date"
                    className="form-control"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <button
                  className="button booking-button"
                  onClick={handleBooking}
                  disabled={!selectedDate}
                >
                  Book Now
                </button>

                <p className="booking-note">
                  You won't be charged yet. Payment is processed after service completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;