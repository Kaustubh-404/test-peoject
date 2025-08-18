// File: src/services/auth.service.ts (Fixed Version)
import { authApi } from "../config/axios";
import type { AgencyLoginRequest, AuthResponse, GuardLoginRequest, User } from "../types/auth.types";

export const authService = {
  // Agency user login with enhanced debugging
  agencyLogin: async (data: AgencyLoginRequest): Promise<AuthResponse> => {
    try {
      console.log("🔄 Attempting login with:", {
        email: data.email,
        passwordLength: data.password?.length,
        baseURL: authApi.defaults.baseURL,
        endpoint: "/auth/agency-login",
      });

      const response = await authApi.post("/auth/agency-login", data);

      console.log("📥 Raw server response:", response.data);

      // Handle different response formats from server
      let authResponse: AuthResponse;

      if (response.data.success && response.data.data) {
        // Server returns { success: true, data: { access_token, user }, timestamp }
        console.log("📋 Server response format: success wrapper");
        authResponse = {
          access_token: response.data.data.access_token,
          user: response.data.data.user,
        };
      } else if (response.data.access_token && response.data.user) {
        // Server returns { access_token, user } directly
        console.log("📋 Server response format: direct");
        authResponse = response.data;
      } else if (response.data.data && response.data.data.access_token) {
        // Server returns { data: { access_token, user } }
        console.log("📋 Server response format: data wrapper");
        authResponse = response.data.data;
      } else {
        console.error("❌ Unexpected response format:", response.data);
        throw new Error("Unexpected response format from server");
      }

      // Validate the response has required fields
      if (!authResponse.access_token) {
        throw new Error("No access token received from server");
      }

      if (!authResponse.user) {
        throw new Error("No user data received from server");
      }

      console.log("✅ Login successful:", {
        userEmail: authResponse.user.email || "No email",
        userId: authResponse.user.id || "No ID",
        hasToken: !!authResponse.access_token,
        tokenLength: authResponse.access_token?.length,
      });

      return authResponse;
    } catch (error: any) {
      console.error("❌ Login error details:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          timeout: error.config?.timeout,
        },
      });

      // Handle specific error cases with better messaging
      if (error.code === "ERR_NETWORK" || error.code === "NETWORK_ERROR") {
        throw new Error("Unable to connect to the authentication server. Please check if the server is running ");
      } else if (error.code === "ECONNREFUSED") {
        throw new Error("Connection refused. The authentication server on port 3000 is not responding.");
      } else if (error.code === "ECONNABORTED") {
        throw new Error("Request timeout. The server took too long to respond.");
      } else if (error.response?.status === 401) {
        throw new Error("Invalid credentials. Please check your email and password.");
      } else if (error.response?.status === 400) {
        throw new Error("Invalid request. Please check your input.");
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else if (!error.response) {
        throw new Error("Network error. Please check your connection and ensure the auth server is running.");
      } else {
        throw new Error(error.response?.data?.message || "Login failed. Please try again.");
      }
    }
  },

  // Guard login (for future use)
  guardLogin: async (data: GuardLoginRequest): Promise<AuthResponse> => {
    try {
      console.log("🔄 Attempting guard login...");
      const response = await authApi.post("/auth/agency-login", data);

      // Handle the same response format variations
      let authResponse: AuthResponse;
      if (response.data.success && response.data.data) {
        authResponse = {
          access_token: response.data.data.access_token,
          user: response.data.data.user,
        };
      } else if (response.data.access_token && response.data.user) {
        authResponse = response.data;
      } else if (response.data.data && response.data.data.access_token) {
        authResponse = response.data.data;
      } else {
        throw new Error("Unexpected response format from server");
      }

      console.log("✅ Guard login successful:", data.phoneNumber);
      return authResponse;
    } catch (error: any) {
      console.error("❌ Guard login error:", error);

      if (error.code === "ERR_NETWORK" || error.code === "NETWORK_ERROR") {
        throw new Error("Unable to connect to the authentication server.");
      } else if (error.response?.status === 401) {
        throw new Error("Invalid OTP. Please check the code and try again.");
      } else if (error.response?.status === 400) {
        throw new Error("Invalid request. Please check your input.");
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      } else if (!error.response) {
        throw new Error("Network error. Please check your connection.");
      } else {
        throw new Error(error.response?.data?.message || "Login failed. Please try again.");
      }
    }
  },

  // Verify token - Handle missing endpoint gracefully
  verifyToken: async (token: string): Promise<User> => {
    try {
      console.log("🔍 Verifying token with server...");
      const response = await authApi.get("/auth/agency-login", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Handle different response formats for user data
      let user: User;
      if (response.data.success && response.data.data) {
        user = response.data.data;
      } else if (response.data.user) {
        user = response.data.user;
      } else if (response.data.email || response.data.id) {
        user = response.data;
      } else {
        throw new Error("Unexpected user data format");
      }

      console.log("✅ Token verified for user:", user.email || user.id || "Unknown user");
      return user;
    } catch (error: any) {
      console.error("❌ Token verification failed:", {
        status: error.response?.status,
        message: error.message,
      });

      if (error.response?.status === 404) {
        // Verify endpoint doesn't exist - this is not necessarily an error
        console.warn("⚠️/auth/agency-login endpoint not found on server. Consider implementing token verification.");
        throw error; // Let the calling code handle this gracefully
      } else if (error.response?.status === 401) {
        // Token is invalid or expired
        console.log("🔄 Token expired, clearing storage");
        throw error;
      }

      throw error;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    console.log("👋 User logged out successfully");
  },

  // Test connection to auth server
  testConnection: async (): Promise<boolean> => {
    try {
      console.log("🔍 Testing connection to auth server...");
      await authApi.get("/health", { timeout: 5000 });
      console.log("✅ Auth server is reachable");
      return true;
    } catch (error: any) {
      console.error("❌ Auth server is not reachable:", {
        message: error.message,
        code: error.code,
        baseURL: authApi.defaults.baseURL,
      });
      return false;
    }
  },
};
