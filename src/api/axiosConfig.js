import axios from "axios";

/**
 * 🌐 BACKEND CONNECTIVITY
 * Loads the URL from .env or defaults to local development port.
 */
const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/**
 * ✅ UNIFIED REQUEST INTERCEPTOR
 * Attaches the 'Ride N Roar' token to every outgoing request.
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
      // Note: AuthContext handles the redirect logic based on this 401
    }
    
    if (status === 403) {
      console.error("🚫 Access Denied: Permissions insufficient for this role.");
    }

    return Promise.reject(error);
  }
);

export default api;