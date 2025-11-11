import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ToastProps, NotificationSettings, ThemeConfig } from "../types";

interface UIState {
  // Theme
  theme: "light" | "dark" | "system";
  primaryColor: string;
  fontSize: "sm" | "md" | "lg";

  // Layout
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;

  // Modals
  modals: Record<string, boolean>;

  // Toasts
  toasts: ToastProps[];

  // Loading states
  loadingStates: Record<string, boolean>;

  // Notifications
  notificationSettings: NotificationSettings;

  // Search
  searchQuery: string;
  searchFilters: Record<string, any>;

  // Pagination
  currentPage: number;
  pageSize: number;
}

interface UIActions {
  // Theme actions
  setTheme: (theme: "light" | "dark" | "system") => void;
  setPrimaryColor: (color: string) => void;
  setFontSize: (size: "sm" | "md" | "lg") => void;

  // Layout actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Modal actions
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  closeAllModals: () => void;

  // Toast actions
  addToast: (toast: Omit<ToastProps, "id">) => void;
  removeToast: (toastId: string) => void;
  clearToasts: () => void;

  // Loading actions
  setLoading: (key: string, loading: boolean) => void;
  clearLoading: (key: string) => void;

  // Notification actions
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;

  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: Record<string, any>) => void;
  clearSearch: () => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Utility actions
  resetUI: () => void;
}

type UIStore = UIState & UIActions;

const initialThemeConfig: ThemeConfig = {
  mode: "system",
  primaryColor: "#D4AF37",
  fontSize: "md",
};

const initialNotificationSettings: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  marketing: false,
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // State
      theme: initialThemeConfig.mode,
      primaryColor: initialThemeConfig.primaryColor,
      fontSize: initialThemeConfig.fontSize,
      sidebarOpen: false,
      mobileMenuOpen: false,
      modals: {},
      toasts: [],
      loadingStates: {},
      notificationSettings: initialNotificationSettings,
      searchQuery: "",
      searchFilters: {},
      currentPage: 1,
      pageSize: 12,

      // Theme actions
      setTheme: (theme) => {
        set({ theme });
        // Apply theme to document
        if (typeof window !== "undefined") {
          document.documentElement.setAttribute("data-theme", theme);
        }
      },

      setPrimaryColor: (color) => {
        set({ primaryColor: color });
        // Apply color to CSS custom property
        if (typeof window !== "undefined") {
          document.documentElement.style.setProperty("--primary", color);
        }
      },

      setFontSize: (size) => {
        set({ fontSize: size });
        // Apply font size to document
        if (typeof window !== "undefined") {
          const sizeMap = { sm: "14px", md: "16px", lg: "18px" };
          document.documentElement.style.fontSize = sizeMap[size];
        }
      },

      // Layout actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      toggleMobileMenu: () => {
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
      },

      setMobileMenuOpen: (open) => {
        set({ mobileMenuOpen: open });
      },

      // Modal actions
      openModal: (modalId) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: true },
        }));
      },

      closeModal: (modalId) => {
        set((state) => ({
          modals: { ...state.modals, [modalId]: false },
        }));
      },

      closeAllModals: () => {
        set({ modals: {} });
      },

      // Toast actions
      addToast: (toast) => {
        const id = `toast-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        const newToast: ToastProps = { ...toast, id };

        set((state) => ({
          toasts: [...state.toasts, newToast],
        }));

        // Auto remove toast after duration
        if (toast.duration !== 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, toast.duration || 5000);
        }
      },

      removeToast: (toastId) => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== toastId),
        }));
      },

      clearToasts: () => {
        set({ toasts: [] });
      },

      // Loading actions
      setLoading: (key, loading) => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, [key]: loading },
        }));
      },

      clearLoading: (key) => {
        set((state) => {
          const { [key]: removed, ...rest } = state.loadingStates;
          return { loadingStates: rest };
        });
      },

      // Notification actions
      updateNotificationSettings: (settings) => {
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...settings },
        }));
      },

      // Search actions
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setSearchFilters: (filters) => {
        set({ searchFilters: filters });
      },

      clearSearch: () => {
        set({ searchQuery: "", searchFilters: {} });
      },

      // Pagination actions
      setCurrentPage: (page) => {
        set({ currentPage: page });
      },

      setPageSize: (size) => {
        set({ pageSize: size, currentPage: 1 });
      },

      // Utility actions
      resetUI: () => {
        set({
          theme: initialThemeConfig.mode,
          primaryColor: initialThemeConfig.primaryColor,
          fontSize: initialThemeConfig.fontSize,
          sidebarOpen: false,
          mobileMenuOpen: false,
          modals: {},
          toasts: [],
          loadingStates: {},
          notificationSettings: initialNotificationSettings,
          searchQuery: "",
          searchFilters: {},
          currentPage: 1,
          pageSize: 12,
        });
      },
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({
        theme: state.theme,
        primaryColor: state.primaryColor,
        fontSize: state.fontSize,
        notificationSettings: state.notificationSettings,
        pageSize: state.pageSize,
      }),
    }
  )
);
