import axios from "axios";

/**
 * 🌐 LOCAL BACKEND CONNECTIVITY
 * Forces the application to route requests directly to your local machine on port 5000.
 * This completely stops your frontend from trying to communicate with Render.
 */
const API_BASE_URL = "http://localhost:5000/api";

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