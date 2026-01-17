import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api", // your backend API
  headers: { "Content-Type": "application/json" },
});

// Add token automatically based on available role
instance.interceptors.request.use(
  (config) => {
    // Prioritize customerToken, then ownerToken, then adminToken
    const customerToken = localStorage.getItem("customerToken");
    const ownerToken = localStorage.getItem("ownerToken");
    const adminToken = localStorage.getItem("adminToken");

    if (customerToken) config.headers.Authorization = `Bearer ${customerToken}`;
    else if (ownerToken) config.headers.Authorization = `Bearer ${ownerToken}`;
    else if (adminToken) config.headers.Authorization = `Bearer ${adminToken}`;

    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
