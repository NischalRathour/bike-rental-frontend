import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// --- REQUEST INTERCEPTOR ---
instance.interceptors.request.use(
  (config) => {
    const token_user = localStorage.getItem("token_user");
    const token_admin = localStorage.getItem("token_admin");
    const token_owner = localStorage.getItem("token_owner");

    const url = config.url || "";

    /**
     * ✅ LOGIC FIX:
     * 1. If we are visiting an admin route OR checking the session while logged as admin, 
     * we MUST use token_admin.
     */
    if (token_admin && (url.includes("/admin") || url.includes("/users/me"))) {
      config.headers.Authorization = `Bearer ${token_admin}`;
    } 
    /**
     * 2. If it's an owner route.
     */
    else if (token_owner && (url.includes("/owner") || url.includes("/bikes/owner"))) {
      config.headers.Authorization = `Bearer ${token_owner}`;
    } 
    /**
     * 3. Fallback to user token for bookings, profile, and general browsing.
     */
    else if (token_user) {
      config.headers.Authorization = `Bearer ${token_user}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
// This part is critical to stop the "Landing Page" loop if the token expires
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401 || status === 403) {
      console.error("🔒 Unauthorized access - Clearing Session");
      
      // If we are in the admin panel and the token fails, clear admin specifically
      if (window.location.pathname.startsWith('/admin')) {
        localStorage.removeItem("token_admin");
        localStorage.removeItem("adminUser");
        window.location.replace("/login"); 
      } else {
        localStorage.removeItem("token_user");
        localStorage.removeItem("userInfo");
        window.location.replace("/login");
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;