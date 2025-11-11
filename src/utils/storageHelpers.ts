import { STORAGE_KEYS } from "./constants";

// Local Storage helpers
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting localStorage item ${key}:`, error);
  }
};

export const getStorageItem = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue || null;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error getting localStorage item ${key}:`, error);
    return defaultValue || null;
  }
};

export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage item ${key}:`, error);
  }
};

export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

// Session Storage helpers
export const setSessionItem = <T>(key: string, value: T): void => {
  try {
    const serializedValue = JSON.stringify(value);
    sessionStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error(`Error setting sessionStorage item ${key}:`, error);
  }
};

export const getSessionItem = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = sessionStorage.getItem(key);
    if (item === null) {
      return defaultValue || null;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error getting sessionStorage item ${key}:`, error);
    return defaultValue || null;
  }
};

export const removeSessionItem = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing sessionStorage item ${key}:`, error);
  }
};

export const clearSession = (): void => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error("Error clearing sessionStorage:", error);
  }
};

// Specific storage helpers for app data (non-auth related)
export const setUserData = <T>(userData: T): void => {
  setStorageItem(STORAGE_KEYS.USER_DATA, userData);
};

export const getUserData = <T>(): T | null => {
  return getStorageItem<T>(STORAGE_KEYS.USER_DATA);
};

export const removeUserData = (): void => {
  removeStorageItem(STORAGE_KEYS.USER_DATA);
};

export const setCartData = <T>(cartData: T): void => {
  setStorageItem(STORAGE_KEYS.CART_DATA, cartData);
};

export const getCartData = <T>(): T | null => {
  return getStorageItem<T>(STORAGE_KEYS.CART_DATA);
};

export const removeCartData = (): void => {
  removeStorageItem(STORAGE_KEYS.CART_DATA);
};

export const setTheme = (theme: string): void => {
  setStorageItem(STORAGE_KEYS.THEME, theme);
};

export const getTheme = (): string | null => {
  return getStorageItem<string>(STORAGE_KEYS.THEME);
};

export const removeTheme = (): void => {
  removeStorageItem(STORAGE_KEYS.THEME);
};

export const setLanguage = (language: string): void => {
  setStorageItem(STORAGE_KEYS.LANGUAGE, language);
};

export const getLanguage = (): string | null => {
  return getStorageItem<string>(STORAGE_KEYS.LANGUAGE);
};

export const removeLanguage = (): void => {
  removeStorageItem(STORAGE_KEYS.LANGUAGE);
};

// Storage event helpers
export const onStorageChange = (
  callback: (key: string, newValue: any, oldValue: any) => void
): (() => void) => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key && event.newValue !== event.oldValue) {
      try {
        const newValue = event.newValue ? JSON.parse(event.newValue) : null;
        const oldValue = event.oldValue ? JSON.parse(event.oldValue) : null;
        callback(event.key, newValue, oldValue);
      } catch (error) {
        console.error("Error parsing storage change:", error);
      }
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};

// Storage quota helpers
export const getStorageQuota = (): Promise<{
  quota: number;
  usage: number;
  available: number;
}> => {
  return new Promise((resolve, reject) => {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      navigator.storage
        .estimate()
        .then((estimate) => {
          resolve({
            quota: estimate.quota || 0,
            usage: estimate.usage || 0,
            available: (estimate.quota || 0) - (estimate.usage || 0),
          });
        })
        .catch(reject);
    } else {
      reject(new Error("Storage quota API not supported"));
    }
  });
};

// Storage cleanup helpers
export const cleanupExpiredStorage = (): void => {
  // This would be used to clean up old cart data, etc.
  const now = Date.now();
  const keysToCheck = [
    STORAGE_KEYS.CART_DATA,
  ];

  keysToCheck.forEach((key) => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        const data = JSON.parse(item);
        if (data.expiresAt && data.expiresAt < now) {
          localStorage.removeItem(key);
        }
      } catch (error) {
        // If parsing fails, remove the item
        localStorage.removeItem(key);
      }
    }
  });
};

// Storage migration helpers
export const migrateStorageData = (
  fromKey: string,
  toKey: string,
  transformer?: (data: any) => any
): void => {
  const oldData = getStorageItem(fromKey);
  if (oldData) {
    const newData = transformer ? transformer(oldData) : oldData;
    setStorageItem(toKey, newData);
    removeStorageItem(fromKey);
  }
};
