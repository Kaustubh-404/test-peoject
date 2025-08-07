// File: src/api/base.ts
import { authApi, guardsApi } from "../config/axios";

// Auth API endpoints (port 3000)
export const authAPI = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await authApi.get<T>(endpoint);
    return response.data;
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await authApi.post<T>(endpoint, data);
    return response.data;
  },

  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await authApi.put<T>(endpoint, data);
    return response.data;
  },

  patch: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await authApi.patch<T>(endpoint, data);
    return response.data;
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await authApi.delete<T>(endpoint);
    return response.data;
  },
};

// Guards API endpoints (port 3001) - with authentication
export const guardsAPI = {
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await guardsApi.get<T>(endpoint);
    return response.data;
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await guardsApi.post<T>(endpoint, data);
    return response.data;
  },

  postFormData: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const response = await guardsApi.post<T>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await guardsApi.put<T>(endpoint, data);
    return response.data;
  },

  putFormData: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const response = await guardsApi.put<T>(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  patch: async <T>(endpoint: string, data?: any): Promise<T> => {
    const response = await guardsApi.patch<T>(endpoint, data);
    return response.data;
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await guardsApi.delete<T>(endpoint);
    return response.data;
  },
};

// Legacy support - keep the original useApi for backward compatibility
const API_BASE_URL = import.meta.env.VITE_DUTY_API_BASE_URL;

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`) as any;
    error.status = response.status;
    error.code = errorData.code;
    error.details = errorData.details;
    throw error;
  }

  return response.json();
};

export const useApi = {
  get: async <T>(endpoint: string): Promise<T> => {
    return request<T>(endpoint);
  },

  post: async <T>(endpoint: string, data?: any): Promise<T> => {
    return request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  postFormData: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    return request<T>(endpoint, {
      method: "POST",
      body: formData,
      headers: {},
    });
  },

  put: async <T>(endpoint: string, data?: any): Promise<T> => {
    return request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  patch: async <T>(endpoint: string, data?: any): Promise<T> => {
    return request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  patchFormData: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    return request<T>(endpoint, {
      method: "PATCH",
      body: formData,
      headers: {},
    });
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    return request<T>(endpoint, {
      method: "DELETE",
    });
  },

  putFormData: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    return request<T>(endpoint, {
      method: "PUT",
      body: formData,
      headers: {},
    });
  },
} as const;
