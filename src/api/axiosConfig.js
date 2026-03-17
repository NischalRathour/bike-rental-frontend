import axios from "axios";

// --- DYNAMIC BASE URL FIX ---
// This pulls the URL from your .env file. 
// If .env is missing, it falls back to localhost:5000 as a safety measure.
const BASE_URL = process.env.REACT_APP_BACKEND_URL 
  ? `${process.env.REACT_APP_BACKEND_URL}/api` 
  : "http://localhost:5000/api";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// --- REQUEST INTERCEPTOR: MULTI-ROLE TOKEN MANAGEMENT ---
instance.interceptors.request.use(
  (config) => {
    const token_user = localStorage.getItem("token_user");
    const token_admin = localStorage.getItem("token_admin");
    const token_owner = localStorage.getItem("token_owner");

    const url = config.url || "";

    /**
     * ✅ ROLE-BASED AUTHORIZATION LOGIC:
     * We prioritize the Admin token if the request is targeting admin endpoints.
     */
    if (token_admin && (url.includes("/admin") || url.includes("/users/me"))) {
      config.headers.Authorization = `Bearer ${token_admin}`;
    } 
    else if (token_owner && (url.includes("/owner") || url.includes("/bikes/owner"))) {
      config.headers.Authorization = `Bearer ${token_owner}`;
    } 
    else if (token_user) {
      config.headers.Authorization = `Bearer ${token_user}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR: SESSION SECURITY ---
// Ensures that expired or invalid tokens don't leave the user stuck in a loop.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401 || status === 403) {
      console.warn("🔒 Security Alert: Session Expired or Unauthorized. Redirecting...");

      // Determine which session to clear based on the current path
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem("token_admin");
        localStorage.removeItem("adminUser");
        window.location.replace("/admin-login"); // Direct to Admin Login specifically
      } else {
        localStorage.removeItem("token_user");
        localStorage.removeItem("userInfo");
        localStorage.removeItem("token_owner"); // Clear owner too just in case
        window.location.replace("/login");
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;