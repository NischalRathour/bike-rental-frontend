import axios from 'axios';

// Clean axios instance for payments (no token interceptor)
const paymentApi = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

export default paymentApi;