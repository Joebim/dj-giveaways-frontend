import { VALIDATION_RULES } from "./constants";

// Email Validation
export const isValidEmail = (email: string): boolean => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

// Phone Validation
export const isValidPhone = (phone: string): boolean => {
  return VALIDATION_RULES.PHONE_REGEX.test(phone);
};

// Postcode Validation
export const isValidPostcode = (postcode: string): boolean => {
  return VALIDATION_RULES.POSTCODE_REGEX.test(postcode);
};

// Password Validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
};

export const getPasswordStrength = (
  password: string
): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("Password must be at least 8 characters long");
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Password must contain at least one lowercase letter");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Password must contain at least one uppercase letter");
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push("Password must contain at least one number");
  }

  if (/[^a-zA-Z\d]/.test(password)) {
    score += 1;
  } else {
    feedback.push("Password must contain at least one special character");
  }

  return { score, feedback };
};

// Name Validation
export const isValidName = (name: string): boolean => {
  return (
    name.length >= VALIDATION_RULES.NAME_MIN_LENGTH &&
    name.length <= VALIDATION_RULES.NAME_MAX_LENGTH
  );
};

// Age Validation
export const isValidAge = (dateOfBirth: Date): boolean => {
  const today = new Date();
  const age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    return age - 1 >= 18;
  }

  return age >= 18;
};

// URL Validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Credit Card Validation (Luhn Algorithm)
export const isValidCreditCard = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\D/g, "");

  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// CVV Validation
export const isValidCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

// Expiry Date Validation
export const isValidExpiryDate = (month: string, year: string): boolean => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const expMonth = parseInt(month);
  const expYear = parseInt(year);

  if (expMonth < 1 || expMonth > 12) {
    return false;
  }

  if (
    expYear < currentYear ||
    (expYear === currentYear && expMonth < currentMonth)
  ) {
    return false;
  }

  return true;
};

// Form Validation Helpers
export const validateRequired = (value: any): string | null => {
  if (value === null || value === undefined || value === "") {
    return "This field is required";
  }
  return null;
};

export const validateMinLength = (
  value: string,
  minLength: number
): string | null => {
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters long`;
  }
  return null;
};

export const validateMaxLength = (
  value: string,
  maxLength: number
): string | null => {
  if (value.length > maxLength) {
    return `Must be no more than ${maxLength} characters long`;
  }
  return null;
};

export const validateMin = (value: number, min: number): string | null => {
  if (value < min) {
    return `Must be at least ${min}`;
  }
  return null;
};

export const validateMax = (value: number, max: number): string | null => {
  if (value > max) {
    return `Must be no more than ${max}`;
  }
  return null;
};

export const validateRange = (
  value: number,
  min: number,
  max: number
): string | null => {
  if (value < min || value > max) {
    return `Must be between ${min} and ${max}`;
  }
  return null;
};

// Competition Specific Validation
export const validateTicketQuantity = (
  quantity: number,
  maxTickets: number,
  soldTickets: number
): string | null => {
  const availableTickets = maxTickets - soldTickets;

  if (quantity <= 0) {
    return "Quantity must be greater than 0";
  }

  if (quantity > availableTickets) {
    return `Only ${availableTickets} tickets remaining`;
  }

  if (quantity > 100) {
    return "Maximum 100 tickets per order";
  }

  return null;
};

export const validateCompetitionAnswer = (answer: string): string | null => {
  if (!answer || answer.trim().length === 0) {
    return "Please provide an answer";
  }

  if (answer.trim().length < 2) {
    return "Answer must be at least 2 characters long";
  }

  return null;
};
