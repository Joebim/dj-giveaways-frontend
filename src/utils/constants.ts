// App Constants
export const APP_NAME = "DJ Giveaways";
export const APP_VERSION = "1.0.0";
export const APP_DESCRIPTION =
  "Premium UK-based online skill-based competition platform";

// API Configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
export const API_TIMEOUT = 10000;

// Routes
export const ROUTES = {
  HOME: "/",
  COMPETITIONS: "/competitions",
  COMPETITION_DETAIL: "/competitions/:id",
  CART: "/cart",
  CHECKOUT: "/checkout",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  PROFILE: "/profile",
  MY_ENTRIES: "/profile/entries",
  ORDER_HISTORY: "/profile/orders",
  SETTINGS: "/profile/settings",
  WINNERS: "/winners",
  ABOUT: "/about",
  HOW_IT_WORKS: "/how-it-works",
  CONTACT: "/contact",
  TERMS: "/legal/terms",
  PRIVACY: "/legal/privacy",
  COOKIE_POLICY: "/legal/cookies",
  ADMIN: "/admin",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_COMPETITIONS: "/admin/competitions",
  ADMIN_USERS: "/admin/users",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_DRAWS: "/admin/draws",
} as const;

// Competition Constants
export const COMPETITION_STATUS = {
  DRAFT: "draft",
  UPCOMING: "upcoming",
  ACTIVE: "active",
  DRAWING: "drawing",
  COMPLETED: "completed",
  ENDED: "ended",
  DRAWN: "drawn",
  CANCELLED: "cancelled",
} as const;

export const COMPETITION_CATEGORIES = {
  LUXURY_CARS: "Luxury Cars",
  TECH_GADGETS: "Tech & Gadgets",
  HOLIDAYS: "Holidays",
  CASH_PRIZES: "Cash Prizes",
  HOME_GARDEN: "Home & Garden",
  FASHION_WATCHES: "Fashion & Watches",
  EXPERIENCES: "Experiences",
  OTHER: "Other",
} as const;

// User Roles
export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  MODERATOR: "moderator",
} as const;

// Order Status
export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "royal_competitions_auth_token",
  REFRESH_TOKEN: "royal_competitions_refresh_token",
  USER_DATA: "royal_competitions_user_data",
  CART_DATA: "royal_competitions_cart_data",
  THEME: "royal_competitions_theme",
  LANGUAGE: "royal_competitions_language",
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [12, 24, 48, 96],
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/,
  POSTCODE_REGEX: /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "dd MMM yyyy",
  DISPLAY_WITH_TIME: "dd MMM yyyy HH:mm",
  API: "yyyy-MM-dd",
  API_WITH_TIME: "yyyy-MM-dd HH:mm:ss",
  SHORT: "dd/MM/yyyy",
  LONG: "EEEE, dd MMMM yyyy",
} as const;

// Currency
export const CURRENCY = {
  SYMBOL: "£",
  CODE: "GBP",
  DECIMAL_PLACES: 2,
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
} as const;

// Social Media
export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com/royalcompetitions",
  TWITTER: "https://twitter.com/royalcompetitions",
  INSTAGRAM: "https://instagram.com/royalcompetitions",
  YOUTUBE: "https://youtube.com/royalcompetitions",
  TIKTOK: "https://tiktok.com/@royalcompetitions",
} as const;

// Contact Information
export const CONTACT_INFO = {
  EMAIL: "support@royalcompetitions.com",
  PHONE: "+44 20 1234 5678",
  ADDRESS: {
    LINE1: "123 Royal Street",
    CITY: "London",
    COUNTY: "Greater London",
    POSTCODE: "SW1A 1AA",
    COUNTRY: "United Kingdom",
  },
} as const;
