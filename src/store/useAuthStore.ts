import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, LoginCredentials, RegisterData } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setAuth: (user: User) => void;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions - These will be called by TanStack Query mutations
      login: async (_credentials: LoginCredentials) => {
        // This will be handled by useLoginMutation
        set({ isLoading: true, error: null });
      },

      register: async (_data: RegisterData) => {
        // This will be handled by useRegisterMutation
        set({ isLoading: true, error: null });
      },

      logout: () => {
        // No need to clear tokens - cookies are handled server-side
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setAuth: (user: User) => {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...userData };
        set({ user: updatedUser });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          // Check if user is authenticated by calling profile endpoint
          // This will be handled by the auth query hook
          set({ isLoading: false });
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
