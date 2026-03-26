import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL 
  ? `${process.env.REACT_APP_BACKEND_URL}/api` 
  : 'http://localhost:5000/api';

const paymentApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
});

// ✅ FIXED: Look for the unified token 'token_ride_roar'
paymentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token_ride_roar'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

paymentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error("🔒 Payment Unauthorized. Token missing or invalid.");
      // Optional: Clear storage and redirect if token is dead
      // localStorage.clear();
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default paymentApi;