import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(
  (config) => {
    const token_user = localStorage.getItem("token_user");     // customer
    const token_owner = localStorage.getItem("token_owner");   // owner
    const token_admin = localStorage.getItem("token_admin");   // admin

    console.log("🔑 Token check:");
    console.log("  user:", token_user ? "✓" : "✗");
    console.log("  owner:", token_owner ? "✓" : "✗");
    console.log("  admin:", token_admin ? "✓" : "✗");

    const url = config.url || "";

    // 🔴 BOOKINGS → CUSTOMER ONLY
    if (url.includes("/bookings")) {
      if (token_user) {
        config.headers.Authorization = `Bearer ${token_user}`;
        console.log("  Using token_user (booking)");
      }
    }

    // 🟢 OWNER ROUTES
    else if (url.includes("/bikes/owner") || url.includes("/owner")) {
      if (token_owner) {
        config.headers.Authorization = `Bearer ${token_owner}`;
        console.log("  Using token_owner");
      }
    }

    // 🟣 ADMIN ROUTES
    else if (url.includes("/admin")) {
      if (token_admin) {
        config.headers.Authorization = `Bearer ${token_admin}`;
        console.log("  Using token_admin");
      }
    }

    // 🔵 DEFAULT (profile, bikes list, etc.)
    else if (token_user) {
      config.headers.Authorization = `Bearer ${token_user}`;
      console.log("  Using token_user (default)");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
