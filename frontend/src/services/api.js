import axios from "axios";

// ✅ For Vite, environment variables must be prefixed with VITE_
// You can keep a .env file for local dev:
// VITE_API_URL=http://localhost:5000/api

// Update this for deployment
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://online-application-ol5t.onrender.com/api";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
});

// Add token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("🔥 TOKEN BEING SENT:", token);
  console.log("🔥 REQUEST URL:", req.baseURL + req.url);
  console.log("🔥 HEADERS BEFORE:", req.headers);

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  console.log("🔥 HEADERS AFTER:", req.headers);

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