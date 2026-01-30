import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// UPDATED: Correct token names
instance.interceptors.request.use(
  (config) => {
    // Check for tokens with correct names
    const token_user = localStorage.getItem("token_user");    // Customer
    const token_owner = localStorage.getItem("token_owner");  // Owner  
    const token_admin = localStorage.getItem("token_admin");  // Admin
    
    console.log("🔑 Token check in interceptor:");
    console.log("  token_user:", token_user ? "✓" : "✗");
    console.log("  token_owner:", token_owner ? "✓" : "✗");
    console.log("  token_admin:", token_admin ? "✓" : "✗");

    // Priority: user (customer) → owner → admin
    if (token_user) {
      config.headers.Authorization = `Bearer ${token_user}`;
      console.log("  Using: token_user (customer)");
    } else if (token_owner) {
      config.headers.Authorization = `Bearer ${token_owner}`;
      console.log("  Using: token_owner");
    } else if (token_admin) {
      config.headers.Authorization = `Bearer ${token_admin}`;
      console.log("  Using: token_admin");
    } else {
      console.log("  No token found");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;