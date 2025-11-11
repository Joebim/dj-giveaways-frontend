import {
  format,
  formatDistanceToNow,
  isAfter,
  isBefore,
  addDays,
  addHours,
  addMinutes,
  parseISO,
} from "date-fns";

// Date manipulation helpers
export const addDaysToDate = (date: Date | string, days: number): Date => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return addDays(dateObj, days);
};

export const addHoursToDate = (date: Date | string, hours: number): Date => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return addHours(dateObj, hours);
};

export const addMinutesToDate = (
  date: Date | string,
  minutes: number
): Date => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return addMinutes(dateObj, minutes);
};

// Date comparison helpers
export const isDateAfter = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = typeof date1 === "string" ? parseISO(date1) : date1;
  const d2 = typeof date2 === "string" ? parseISO(date2) : date2;
  return isAfter(d1, d2);
};

export const isDateBefore = (
  date1: Date | string,
  date2: Date | string
): boolean => {
  const d1 = typeof date1 === "string" ? parseISO(date1) : date1;
  const d2 = typeof date2 === "string" ? parseISO(date2) : date2;
  return isBefore(d1, d2);
};

// Competition date helpers
export const isCompetitionActive = (
  startDate: Date | string,
  endDate: Date | string
): boolean => {
  const now = new Date();
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;

  return isAfter(now, start) && isBefore(now, end);
};

export const isCompetitionUpcoming = (startDate: Date | string): boolean => {
  const now = new Date();
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;

  return isAfter(start, now);
};

export const isCompetitionEnded = (endDate: Date | string): boolean => {
  const now = new Date();
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;

  return isAfter(now, end);
};

export const getTimeUntilStart = (startDate: Date | string): string => {
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  return formatDistanceToNow(start, { addSuffix: true });
};

export const getTimeUntilEnd = (endDate: Date | string): string => {
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
  return formatDistanceToNow(end, { addSuffix: true });
};

// Countdown helpers
export const getCountdownData = (
  targetDate: Date | string
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  isExpired: boolean;
} => {
  const target =
    typeof targetDate === "string" ? parseISO(targetDate) : targetDate;
  const now = new Date();
  const total = Math.max(0, target.getTime() - now.getTime());

  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    total,
    isExpired: total <= 0,
  };
};

// Date range helpers
export const getDateRange = (
  startDate: Date | string,
  endDate: Date | string
): {
  start: Date;
  end: Date;
  duration: number; // in days
} => {
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
  const duration = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  return { start, end, duration };
};

// Business days helpers
export const isBusinessDay = (date: Date | string): boolean => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const day = dateObj.getDay();
  return day !== 0 && day !== 6; // Not Sunday (0) or Saturday (6)
};

export const getNextBusinessDay = (date: Date | string): Date => {
  let nextDay = addDaysToDate(date, 1);

  while (!isBusinessDay(nextDay)) {
    nextDay = addDaysToDate(nextDay, 1);
  }

  return nextDay;
};

// Timezone helpers
export const getTimezoneOffset = (): number => {
  return new Date().getTimezoneOffset();
};

export const convertToUTC = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return new Date(dateObj.getTime() + dateObj.getTimezoneOffset() * 60000);
};

export const convertFromUTC = (date: Date | string): Date => {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
};

// Age calculation
export const calculateAge = (birthDate: Date | string): number => {
  const birth = typeof birthDate === "string" ? parseISO(birthDate) : birthDate;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// Date formatting helpers
export const formatDateRange = (
  startDate: Date | string,
  endDate: Date | string
): string => {
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;

  const startFormatted = format(start, "MMM dd");
  const endFormatted = format(end, "MMM dd, yyyy");

  return `${startFormatted} - ${endFormatted}`;
};

export const formatTimeRemaining = (targetDate: Date | string): string => {
  const countdown = getCountdownData(targetDate);

  if (countdown.isExpired) {
    return "Expired";
  }

  if (countdown.days > 0) {
    return `${countdown.days}d ${countdown.hours}h ${countdown.minutes}m`;
  } else if (countdown.hours > 0) {
    return `${countdown.hours}h ${countdown.minutes}m ${countdown.seconds}s`;
  } else if (countdown.minutes > 0) {
    return `${countdown.minutes}m ${countdown.seconds}s`;
  } else {
    return `${countdown.seconds}s`;
  }
};
