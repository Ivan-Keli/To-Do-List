import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available in the future
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText || 'An error occurred';
      console.error('API Error:', {
        status: error.response.status,
        message,
        url: error.config?.url
      });
      
      switch (error.response.status) {
        case 401:
          // Handle unauthorized access
          console.warn('Unauthorized access');
          break;
        case 403:
          console.warn('Forbidden access');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          break;
      }
      
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      console.error('Error:', error.message);
      return Promise.reject(new Error(error.message));
    }
  }
);

export default api;
