export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string | number;
  align?: "left" | "center" | "right";
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
}

export interface ToastProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  status?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  marketing: boolean;
}

export interface ThemeConfig {
  mode: "light" | "dark" | "system";
  primaryColor: string;
  fontSize: "sm" | "md" | "lg";
}
