// API service for connecting to the backend

const API_URL = 'http://localhost:5000/api';

// Helper function for making API requests
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    // If the response is not ok, throw an error
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'An error occurred');
    }
    
    // If the response is empty, return null
    if (response.status === 204) {
      return null;
    }

    // Otherwise, return the JSON data
    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth services
export const login = (credentials) => apiRequest('/auth/login', 'POST', credentials);
export const register = (userData) => apiRequest('/auth/register', 'POST', userData);

// User services
export const getCurrentUser = () => apiRequest('/users/me');
export const updateUserProfile = (userData) => apiRequest('/users/me', 'PUT', userData);

// Service services
export const getAllServices = () => apiRequest('/services');
export const getService = (id) => apiRequest(`/services/${id}`);
export const createService = (serviceData) => apiRequest('/services', 'POST', serviceData);
export const updateService = (id, serviceData) => apiRequest(`/services/${id}`, 'PUT', serviceData);
export const deleteService = (id) => apiRequest(`/services/${id}`, 'DELETE');

// Booking services
export const getUserBookings = () => apiRequest('/bookings');
export const getBooking = (id) => apiRequest(`/bookings/${id}`);
export const createBooking = (bookingData) => apiRequest('/bookings', 'POST', bookingData);
export const updateBooking = (id, bookingData) => apiRequest(`/bookings/${id}`, 'PUT', bookingData);
export const cancelBooking = (id) => apiRequest(`/bookings/${id}/cancel`, 'PUT');

// Review services
export const getServiceReviews = (serviceId) => apiRequest(`/reviews/service/${serviceId}`);
export const createReview = (reviewData) => apiRequest('/reviews', 'POST', reviewData);

export default {
  login,
  register,
  getCurrentUser,
  updateUserProfile,
  getAllServices,
  getService,
  createService,
  updateService,
  deleteService,
  getUserBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  getServiceReviews,
  createReview
};