import api from "./api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ProfileResponse,
  AdminAuthResponse,
  VerifyAdminResponse,
} from "../types";

/**
 * API Client for Authentication Services
 * Handles all authentication-related API calls with proper error handling
 */
class AuthApiClient {
  /**
   * Generic method to handle API responses
   * Handles the new cookie-based response format
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async handleResponse<T>(response: any): Promise<T> {
    // Handle the new response format: { success: boolean, data: T, message: string }
    if (response.data?.data) {
      return response.data.data;
    }
    if (response.data) {
      return response.data as T;
    }
    return response as T;
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    return this.handleResponse<AuthResponse>(response);
  }

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return this.handleResponse<AuthResponse>(response);
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ProfileResponse> {
    const response = await api.get<ProfileResponse>("/auth/profile");
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<User>("/auth/profile", data);
    return this.handleResponse<User>(response);
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/auth/forgot-password",
      { email }
    );
    return this.handleResponse<{ message: string }>(response);
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/auth/reset-password",
      {
        token,
        password,
      }
    );
    return this.handleResponse<{ message: string }>(response);
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>("/auth/verify-email", {
      token,
    });
    return this.handleResponse<{ message: string }>(response);
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<{ token: string; refreshToken: string }> {
    const response = await api.post<{ token: string; refreshToken: string }>(
      "/auth/refresh"
    );
    return this.handleResponse<{ token: string; refreshToken: string }>(
      response
    );
  }

  /**
   * Change password (for authenticated users)
   */
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/auth/change-password",
      {
        currentPassword,
        newPassword,
      }
    );
    return this.handleResponse<{ message: string }>(response);
  }

  /**
   * Admin login with email and password
   */
  async adminLogin(credentials: LoginRequest): Promise<AdminAuthResponse> {
    const response = await api.post<AdminAuthResponse>("/auth/admin/login", credentials);
    return this.handleResponse<AdminAuthResponse>(response);
  }

  /**
   * Verify admin status
   */
  async verifyAdminStatus(): Promise<VerifyAdminResponse> {
    const response = await api.get<VerifyAdminResponse>("/auth/admin/verify");
    return this.handleResponse<VerifyAdminResponse>(response);
  }
}

// Export singleton instance
export const authService = new AuthApiClient();
