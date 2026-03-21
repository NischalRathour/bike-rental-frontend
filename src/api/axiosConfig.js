import axios from "axios";

/**
 * --- DYNAMIC BASE URL ---
 * Supports production (.env) and local development fallbacks.
 */
const BASE_URL = process.env.REACT_APP_BACKEND_URL 
  ? `${process.env.REACT_APP_BACKEND_URL}/api` 
  : "http://localhost:5000/api";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * --- REQUEST INTERCEPTOR: MULTI-ROLE SECURITY ---
 * Dynamically selects the correct Bearer token based on the API route.
 */
instance.interceptors.request.use(
  (config) => {
    const token_user = localStorage.getItem("token_user");
    const token_admin = localStorage.getItem("token_admin");
    const token_owner = localStorage.getItem("token_owner");

    const url = config.url || "";

    // 🛡️ ROLE-BASED TOKEN INJECTION
    // Priority 1: Admin Routes
    if (token_admin && (url.includes("admin") || url.includes("insights"))) {
      config.headers.Authorization = `Bearer ${token_admin}`;
      console.log(`📡 [Admin Request]: ${url}`);
    } 
    // Priority 2: Owner Routes
    else if (token_owner && (url.includes("owner") || url.includes("bikes/owner"))) {
      config.headers.Authorization = `Bearer ${token_owner}`;
      console.log(`📡 [Owner Request]: ${url}`);
    } 
    // Priority 3: Standard User Routes
    else if (token_user) {
      config.headers.Authorization = `Bearer ${token_user}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * --- RESPONSE INTERCEPTOR: GLOBAL ERROR HANDLING ---
 * Automatically handles 401/403 (Unauthorized) by clearing local storage and redirecting.
 */
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const message = error.response?.data?.message || "Server Error";

    if (status === 401 || status === 403) {
      console.error(`🔒 Security Alert [${status}]: ${message}`);

      // Smart Redirect Logic
      const is_admin_path = window.location.pathname.startsWith('/admin');

      if (is_admin_path) {
        localStorage.removeItem("token_admin");
        localStorage.removeItem("adminUser");
        window.location.href = "/admin-login"; 
      } else {
        localStorage.removeItem("token_user");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token_owner");
        window.location.href = "/login";
      }
    }

    // Pass the error back so the Component can handle the 500 error display
    return Promise.reject(error);
  }
);

export default instance;