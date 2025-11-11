import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    
    // Handle validation errors (422)
    if (error.response?.status === 422 && data?.errors) {
      const firstError = Object.values(data.errors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        return firstError[0];
      }
    }

    // Handle custom error message
    if (data?.message) {
      return data.message;
    }

    // Handle error string
    if (typeof data === 'string') {
      return data;
    }

    // Fallback to status text
    if (error.response?.statusText) {
      return error.response.statusText;
    }

    // Network error
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }

    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.';
    }
  }

  // Handle Error instance
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Default error message
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Extract validation errors from API error response
 */
export const getValidationErrors = (error: unknown): Record<string, string> => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    
    if (error.response?.status === 422 && data?.errors) {
      const validationErrors: Record<string, string> = {};
      
      Object.entries(data.errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
          validationErrors[field] = messages[0];
        }
      });
      
      return validationErrors;
    }
  }

  return {};
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED';
  }
  return false;
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError) {
    return error.response?.status === 401 || error.response?.status === 403;
  }
  return false;
};

