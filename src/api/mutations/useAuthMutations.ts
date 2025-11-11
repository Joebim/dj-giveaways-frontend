import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../utils/errorHandler';
import type { LoginRequest, RegisterRequest } from '../../types';
import { authKeys } from '../../hooks/useAuthQuery';

// Login Mutation
export const useLoginMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      return authService.login(credentials);
    },
    onSuccess: (data) => {
      setAuth(data.user);
      queryClient.setQueryData(authKeys.profile(), data.user);
      toast.success('Welcome back! You have successfully logged in.');
      navigate('/profile');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

// Register Mutation
export const useRegisterMutation = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      return authService.register(data);
    },
    onSuccess: (data) => {
      setAuth(data.user);
      queryClient.setQueryData(authKeys.profile(), data.user);
      toast.success('Account created successfully! Welcome to DJ Giveaways!');
      navigate('/profile');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

// Get Profile Query
export const useProfileQuery = () => {
  const { setUser } = useAuthStore();
  
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      const response = await authService.getProfile();
      setUser(response.user);
      return response.user;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Update Profile Mutation
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: async (data: any) => {
      return authService.updateProfile(data);
    },
    onSuccess: (data) => {
      updateUser(data);
      queryClient.setQueryData(authKeys.profile(), data);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

// Forgot Password Mutation
export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      return authService.forgotPassword(email);
    },
    onSuccess: () => {
      toast.success('Password reset link has been sent to your email.');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

// Reset Password Mutation
export const useResetPasswordMutation = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      return authService.resetPassword(token, password);
    },
    onSuccess: () => {
      toast.success('Password has been reset successfully. Please login with your new password.');
      navigate('/auth/login');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      toast.error(message);
    },
  });
};

