import axios from 'axios';

// 1. Dynamic Base URL to match your .env configuration
const BASE_URL = process.env.REACT_APP_BACKEND_URL 
  ? `${process.env.REACT_APP_BACKEND_URL}/api` 
  : 'http://localhost:5000/api';

const paymentApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for Stripe processing
});

// 2. Request Interceptor
// CRITICAL: Stripe intents must be linked to a user. 
// We must attach the token so the backend knows who is paying.
paymentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_user');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Response Interceptor
// Handles errors specifically for payment timeouts or unauthorized attempts
paymentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error("💳 Payment Gateway Timeout. Check your connection.");
    }
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("🔒 Payment Unauthorized. Please log in again.");
      // Optional: window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default paymentApi;