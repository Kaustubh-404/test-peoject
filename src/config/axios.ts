// File: config/axios.ts
import axios from "axios";

// Load base URLs from .env
const dutyApiBaseUrl = import.meta.env.VITE_DUTY_API_BASE_URL;
const coreApiBaseUrl = import.meta.env.VITE_CORE_API_BASE_URL;

// Create axios instance for auth service (port 3000)
export const authApi = axios.create({
  baseURL: dutyApiBaseUrl, //"http://127.0.0.1:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create axios instance for guards service (port 3001)
export const guardsApi = axios.create({
  baseURL: coreApiBaseUrl, //"http://127.0.0.1:3001",
  timeout: 30000, // Increased timeout for file uploads
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token to guards API requests
guardsApi.interceptors.request.use(
  (config) => {
    // Get token from localStorage - check multiple possible keys
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken") || localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Don't override Content-Type for FormData (multipart uploads)
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    console.log(`🔗 Guards API Request: ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    console.error("❌ Guards API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for guards API
guardsApi.interceptors.response.use(
  (response) => {
    console.log(`✅ Guards API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ Guards API Response Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);

    // Handle unauthorized responses
    if (error.response?.status === 401) {
      console.log("🔒 Unauthorized - redirecting to login");
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      // Optionally redirect to login page
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Request interceptor for auth API - ADD AUTHENTICATION
authApi.interceptors.request.use(
  (config) => {
    // Get token from localStorage - check multiple possible keys
    const token =
      localStorage.getItem("token") || localStorage.getItem("authToken") || localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("  - ❌ No token found, request will likely fail");
    }

    console.log(`🔗 Auth API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Auth API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for auth API
authApi.interceptors.response.use(
  (response) => {
    console.log(`✅ Auth API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ Auth API Response Error: ${error.response?.status} ${error.config?.url}`, error.response?.data);

    // Handle unauthorized responses
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      // Optionally redirect to login page
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default { authApi, guardsApi };
