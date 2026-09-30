import axios from 'axios';

// Centralized Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if available in localStorage
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('petCareUser');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error message consistently
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message || 'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default API;
