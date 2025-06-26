import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import '../styles/ProviderRegister.css';
import AppLayout from '@cloudscape-design/components/app-layout';
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
import Select from '@cloudscape-design/components/select';
import Wizard from '@cloudscape-design/components/wizard';
import Textarea from '@cloudscape-design/components/textarea';

const ProviderRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    businessName: '',
    category: '',
    subcategory: '',
    experience: '',
    bio: '',
    services: [],
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { id: 'home_improvement', name: 'Home Improvement' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'moving', name: 'Moving' },
    { id: 'errands', name: 'Errands' },
    { id: 'personal', name: 'Personal' },
    { id: 'tech', name: 'Tech' },
    { id: 'events', name: 'Events' },
    { id: 'cultural', name: 'Cultural' }
  ];

  const subcategories = {
    home_improvement: ['Handyman', 'Plumbing', 'Electrical', 'Carpentry', 'Painting', 'Garden Design', 'African Gardening'],
    cleaning: ['House Cleaning', 'Deep Cleaning', 'Move-in/Move-out', 'Commercial Cleaning'],
    moving: ['Local Moving', 'Long Distance', 'Furniture Assembly', 'Junk Removal', 'International Shipping'],
    errands: ['Shopping', 'Delivery', 'Healthcare', 'Post Office', 'Banking', 'Government Offices', 'Item Returns'],
    personal: ['Hair Styling', 'Hair Braiding', 'Personal Training', 'Life Coaching', 'Tutoring', 'Tailoring'],
    tech: ['Computer Repair', 'IT Support', 'Smart Home Setup', 'Data Recovery', 'Money Transfer Services'],
    events: ['Photography', 'Videography', 'Catering', 'African Cuisine', 'Traditional Ceremonies', 'Event Planning'],
    cultural: ['Language Translation', 'Cultural Consultation', 'Immigration Services', 'Document Preparation', 'Community Integration']
  };

  const experienceOptions = [
    '0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'
  ];

  const onChange = (e, field) => {
    setFormData({ 
      ...formData, 
      [field]: e.detail ? e.detail.value : e 
    });
  };
  
  const onCategoryChange = (e) => {
    setFormData({
      ...formData,
      category: e.detail.selectedOption.value,
      subcategory: ''
    });
  };
  
  const onSubcategoryChange = (e) => {
    setFormData({
      ...formData,
      subcategory: e.detail.selectedOption.value
    });
  };
  
  const onExperienceChange = (e) => {
    setFormData({
      ...formData,
      experience: e.detail.selectedOption.value
    });
  };
  
  const onCheckboxChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.detail.checked
    });
  };

  const nextStep = () => {
    if (step === 1) {
      // Validate first step
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
        setError('Please fill all required fields');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    setError('');
    setStep(step + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(step - 1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.agreeTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);

    // In a real app, this would make an API request
    // For demo purposes, we'll simulate registration
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: 'pro123',
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: 'provider',
        businessName: formData.businessName,
        category: formData.category,
        subcategory: formData.subcategory
      }));
      
      navigate('/profile');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container provider-register">
      <div className="auth-card provider-card">
        <div className="auth-header">
          <h1>Become a Service Provider</h1>
          <p>Join our community of professionals and grow your business</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <div className="registration-steps">
          <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
            <div className="step-number">1</div>
            <div className="step-label">Account</div>
          </div>
          <div className="step-line"></div>
          <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
            <div className="step-number">2</div>
            <div className="step-label">Business</div>
          </div>
          <div className="step-line"></div>
          <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <div className="step-label">Services</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {/* Step 1: Account Information */}
          {step === 1 && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First Name*</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="form-control"
                    value={formData.firstName}
                    onChange={onChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last Name*</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="form-control"
                    value={formData.lastName}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={onChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  value={formData.confirmPassword}
                  onChange={onChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="button button-full"
                  onClick={nextStep}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 2: Business Information */}
          {step === 2 && (
            <>
              <div className="form-group">
                <label htmlFor="businessName" className="form-label">Business Name (Optional)</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  className="form-control"
                  value={formData.businessName}
                  onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">Service Category*</label>
                <select
                  id="category"
                  name="category"
                  className="form-control"
                  value={formData.category}
                  onChange={onChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              {formData.category && (
                <div className="form-group">
                  <label htmlFor="subcategory" className="form-label">Service Subcategory*</label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    className="form-control"
                    value={formData.subcategory}
                    onChange={onChange}
                    required
                  >
                    <option value="">Select a subcategory</option>
                    {subcategories[formData.category].map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="experience" className="form-label">Years of Experience*</label>
                <select
                  id="experience"
                  name="experience"
                  className="form-control"
                  value={formData.experience}
                  onChange={onChange}
                  required
                >
                  <option value="">Select experience</option>
                  {experienceOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="button button-secondary button-full"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="button button-full"
                  onClick={nextStep}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3: Services Information */}
          {step === 3 && (
            <>
              <div className="form-group">
                <label htmlFor="bio" className="form-label">Bio/Description*</label>
                <textarea
                  id="bio"
                  name="bio"
                  className="form-control"
                  rows="5"
                  value={formData.bio}
                  onChange={onChange}
                  required
                  placeholder="Tell us about your services, expertise, and what makes you stand out."
                />
              </div>
              
              <div className="form-group terms">
                <input 
                  type="checkbox" 
                  id="agreeTerms" 
                  name="agreeTerms" 
                  checked={formData.agreeTerms} 
                  onChange={onChange}
                  required
                />
                <label htmlFor="agreeTerms">
                  I agree to the <Link to="/terms" className="auth-link">Terms of Service</Link> and <Link to="/privacy" className="auth-link">Privacy Policy</Link>
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="button button-secondary button-full"
                  onClick={prevStep}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="button button-full button-accent-gold"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Provider Account'}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegister;