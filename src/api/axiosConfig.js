import axios from "axios";

// 🌐 Load Backend URL from environment variables
const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

/**
 * ✅ Unified Request Interceptor
 * Always uses the same key to ensure the Backend can authorize the Admin node.
 */
api.interceptors.request.use(
  (config) => {
    // 🚩 FIX: Stop checking multiple keys. Use the unified one we set in AuthContext.
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
 * ✅ Global Response Interceptor
 * Handles session expiration and unauthorized access.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401: Unauthorized / Token Expired
    if (error.response?.status === 401) {
      console.warn("🔐 Session Expired or Unauthorized. Wiping vault...");
      
      const isAdminPath = window.location.pathname.startsWith('/admin');
      
      // Clear storage to prevent "Undefined Role" loops
      localStorage.clear();
      
      // Redirect based on where the user was trying to go
      if (isAdminPath) {
        window.location.href = "/admin-login";
      } else {
        window.location.href = "/login";
      }
    }
    
    // 403: Forbidden (Authenticated but wrong role)
    if (error.response?.status === 403) {
      console.error("🚫 Access Denied: Insufficient Permissions.");
    }

    return Promise.reject(error);
  }
);

export default api;