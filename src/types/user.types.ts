export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  subscribedToNewsletter: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}

export type UserRole = "user" | "admin" | "moderator" | "super_admin";

export interface AuthUser extends User {
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  phone?: string;
  acceptTerms: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Address;
}

// Auth-specific types matching the guide
export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  subscribedToNewsletter?: boolean;
}

export interface ProfileResponse {
  user: User;
}

// Admin-specific types
export interface AdminAuthResponse {
  user: User;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export interface VerifyAdminResponse {
  user: User;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export type AdminUserStatusFilter = "active" | "inactive";

export interface AdminUserFilters {
  page?: number;
  limit?: number;
  role?: UserRole;
  status?: AdminUserStatusFilter;
  search?: string;
}

export interface AdminUserListResponse {
  users: User[];
}

export interface CreateAdminUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
  phone?: string;
  isVerified?: boolean;
  isActive?: boolean;
  subscribedToNewsletter?: boolean;
}

export interface UpdateAdminUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  isVerified?: boolean;
  isActive?: boolean;
  subscribedToNewsletter?: boolean;
}

export interface ResetUserPasswordRequest {
  password: string;
}
