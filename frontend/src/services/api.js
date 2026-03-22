import axios from "axios";

// ✅ For Vite, environment variables must be prefixed with VITE_
// In your project root, have a .env file:
// VITE_API_URL=http://localhost:5000/api
// And restart the dev server after creating/editing .env

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Timeout errors
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
      return Promise.reject({
        message: "Request timeout. Please check your internet connection and try again.",
      });
    }

    // Network errors
    if (!error.response) {
      console.error("Network error:", error.message);
      return Promise.reject({
        message: "Network error. Please check your internet connection.",
      });
    }

    // Unauthorized (401)
    if (error.response?.status === 401) {
      console.error("Unauthorized access - token expired");
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
      return Promise.reject({ message: "Unauthorized. Redirecting to login." });
    }

    // Forbidden (403)
    if (error.response?.status === 403) {
      console.error("Forbidden access");
      return Promise.reject({
        message: "You do not have permission to perform this action.",
      });
    }

    // Server errors (500+)
    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
      return Promise.reject({
        message: "Server error. Please try again later.",
      });
    }

    // Validation errors (400)
    if (error.response?.status === 400) {
      console.error("Validation error:", error.response.data);
      return Promise.reject(error.response.data);
    }

    return Promise.reject(error);
  }
);

export default API;