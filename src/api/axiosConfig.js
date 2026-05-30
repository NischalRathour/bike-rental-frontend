import axios from "axios";

/**
 * 🌐 DYNAMIC ORCHESTRATION ENGINE
 * Automatically detects whether the application is running in the cloud (Vercel)
 * or on your local machine, and sets the API base link dynamically.
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/**
 * ✅ UNIFIED REQUEST INTERCEPTOR
 * Attaches the secure 'Ride N Roar' token to every outgoing request.
 */
api.interceptors.request.use(
  (config) => {
    // Retrieve the token saved during login
    const token = localStorage.getItem("token_ride_roar");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * ✅ GLOBAL RESPONSE INTERCEPTOR
 * Handles auth errors like 401 (Expired) and 403 (Forbidden).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("🔐 Session Expired or Unauthorized.");
    }
    
    if (status === 403) {
      console.error("🚫 Access Denied: Permissions insufficient for this role.");
    }

    return Promise.reject(error);
  }
);

export default api;