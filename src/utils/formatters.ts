import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import { DATE_FORMATS, CURRENCY } from "./constants";

// Date Formatting
export const formatDate = (
  date: Date | string,
  formatString: string = DATE_FORMATS.DISPLAY
): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, formatString);
};

export const formatDateWithTime = (date: Date | string): string => {
  return formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME);
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const formatSmartDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, "HH:mm")}`;
  }

  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, "HH:mm")}`;
  }

  return formatDate(dateObj);
};

// Currency Formatting
export const formatCurrency = (
  amount: number,
  showSymbol: boolean = true
): string => {
  const formatted = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: CURRENCY.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY.DECIMAL_PLACES,
  }).format(amount);

  return showSymbol ? `${CURRENCY.SYMBOL}${formatted}` : formatted;
};

export const formatPrice = (price: number): string => {
  return formatCurrency(price);
};

export const formatLargeNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

// Text Formatting
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Name Formatting
export const formatFullName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

export const formatInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Address Formatting
export const formatAddress = (address: {
  line1: string;
  line2?: string;
  city: string;
  county: string;
  postcode: string;
  country: string;
}): string => {
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.county,
    address.postcode,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
};

// Phone Number Formatting
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "");

  // Format UK phone numbers
  if (cleaned.startsWith("44")) {
    const number = cleaned.slice(2);
    if (number.startsWith("7") && number.length === 10) {
      return `+44 ${number.slice(0, 4)} ${number.slice(4, 7)} ${number.slice(
        7
      )}`;
    }
  }

  if (cleaned.startsWith("07") && cleaned.length === 11) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }

  return phone;
};

// Percentage Formatting
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

// File Size Formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Competition Specific Formatting
export const formatCompetitionStatus = (status: string): string => {
  return capitalizeWords(status.replace("_", " "));
};

export const formatTicketCount = (sold: number, max: number): string => {
  return `${formatLargeNumber(sold)} / ${formatLargeNumber(max)}`;
};

export const formatDrawDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDate(dateObj, "EEEE, dd MMMM yyyy 'at' HH:mm");
};
