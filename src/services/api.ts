import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
  timeout: 10000,
  withCredentials: true, // 🔥 CRITICAL: Include cookies in requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - No need to add tokens (cookies handle this)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Cookies are automatically included with withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally with automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data as { message?: string };

      // Handle 401 Unauthorized - Try to refresh token
      if (status === 401 && !originalRequest?.url?.includes("/auth/refresh")) {
        try {
          // Try to refresh token
          await api.post("/auth/refresh");
          // Retry original request
          return api.request(originalRequest!);
        } catch {
          // Refresh failed, clear auth state and redirect to login
          useAuthStore.getState().logout();
          toast.error("Your session has expired. Please log in again.");
          window.location.href = "/auth/login";
          return Promise.reject(error);
        }
      }

      // Handle 403 Forbidden
      if (status === 403) {
        toast.error("You do not have permission to perform this action.");
        return Promise.reject(error);
      }

      // Handle 500 Server Error
      if (status === 500) {
        toast.error("A server error occurred. Please try again later.");
        return Promise.reject(error);
      }

      // Handle other errors with custom message if available
      if (data?.message) {
        toast.error(data.message);
      }
    } else if (error.request) {
      // Network error
      toast.error("Network error. Please check your connection.");
    } else {
      // Something else happened
      toast.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

export default api;
