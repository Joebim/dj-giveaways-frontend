import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function to merge Tailwind classes
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

// Generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Generate UUID v4
export const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Deep clone object
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  if (typeof obj === "object") {
    const clonedObj = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
};

// Check if object is empty
export const isEmpty = (obj: any): boolean => {
  if (obj === null || obj === undefined) {
    return true;
  }

  if (typeof obj === "string" || Array.isArray(obj)) {
    return obj.length === 0;
  }

  if (typeof obj === "object") {
    return Object.keys(obj).length === 0;
  }

  return false;
};

// Get nested object property safely
export const getNestedValue = (
  obj: any,
  path: string,
  defaultValue?: any
): any => {
  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (
      result === null ||
      result === undefined ||
      !result.hasOwnProperty(key)
    ) {
      return defaultValue;
    }
    result = result[key];
  }

  return result;
};

// Set nested object property safely
export const setNestedValue = (obj: any, path: string, value: any): void => {
  const keys = path.split(".");
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
};

// Remove duplicates from array
export const removeDuplicates = <T>(array: T[], key?: keyof T): T[] => {
  if (!key) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// Group array by key
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key]);
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// Sort array by key
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  direction: "asc" | "desc" = "asc"
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) {
      return direction === "asc" ? -1 : 1;
    }
    if (aVal > bVal) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });
};

// Random number between min and max
export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Random item from array
export const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Shuffle array
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Chunk array into smaller arrays
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Retry function with exponential backoff
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        throw lastError;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, delay * Math.pow(2, attempt - 1))
      );
    }
  }

  throw lastError!;
};

// Sleep function
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Check if running in browser
export const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

// Check if running on mobile
export const isMobile = (): boolean => {
  if (!isBrowser()) return false;
  return window.innerWidth < 768;
};

// Check if running on tablet
export const isTablet = (): boolean => {
  if (!isBrowser()) return false;
  return window.innerWidth >= 768 && window.innerWidth < 1024;
};

// Check if running on desktop
export const isDesktop = (): boolean => {
  if (!isBrowser()) return false;
  return window.innerWidth >= 1024;
};
