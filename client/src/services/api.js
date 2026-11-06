import axios from 'axios';

// Base API configuration
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: automatically attach JWT token from localStorage
API.interceptors.request.use(
  (config) => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('currentUser'));
      if (savedUser && savedUser.token) {
        config.headers.Authorization = `Bearer ${savedUser.token}`;
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized / expired token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired, clear invalid session
      if (localStorage.getItem('currentUser')) {
        console.warn('Session expired. Please log in again.');
      }
    }
    return Promise.reject(error);
  }
);

export default API;
