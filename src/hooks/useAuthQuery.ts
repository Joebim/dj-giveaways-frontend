import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { authService } from "../services/authService";
import { useAuthStore } from "../store/useAuthStore";
import type { User } from "../types";

// Query keys
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
};

type ProfileQueryOptions = Partial<
  UseQueryOptions<
    User,
    Error,
    User,
    ReturnType<typeof authKeys.profile>
  >
>;

// Get profile query
export const useProfile = (options?: ProfileQueryOptions) => {
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
    ...options,
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user);
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
  });
};

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setAuth(data.user);
      queryClient.setQueryData(authKeys.profile(), data.user);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      logout();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
  });
};
