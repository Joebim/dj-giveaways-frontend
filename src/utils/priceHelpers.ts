import { CURRENCY } from "./constants";

// Price calculation helpers
export const calculateSubtotal = (
  items: Array<{ price: number; quantity: number }>
): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const calculateTax = (subtotal: number, taxRate: number = 0): number => {
  return subtotal * taxRate;
};

export const calculateTotal = (
  subtotal: number,
  tax: number = 0,
  shipping: number = 0,
  discount: number = 0
): number => {
  return Math.max(0, subtotal + tax + shipping - discount);
};

// Price formatting helpers
export const formatPrice = (
  price: number,
  showSymbol: boolean = true
): string => {
  const formatted = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: CURRENCY.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY.DECIMAL_PLACES,
  }).format(price);

  return showSymbol ? `${CURRENCY.SYMBOL}${formatted}` : formatted;
};

export const formatPriceRange = (
  minPrice: number,
  maxPrice: number
): string => {
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

export const formatPriceWithDecimals = (price: number): string => {
  return price.toFixed(CURRENCY.DECIMAL_PLACES);
};

// Discount calculation helpers
export const calculatePercentageDiscount = (
  originalPrice: number,
  discountPercentage: number
): number => {
  return originalPrice * (discountPercentage / 100);
};

export const calculateFixedDiscount = (
  originalPrice: number,
  discountAmount: number
): number => {
  return Math.min(discountAmount, originalPrice);
};

export const calculateDiscountedPrice = (
  originalPrice: number,
  discount: number
): number => {
  return Math.max(0, originalPrice - discount);
};

// Price comparison helpers
export const isPriceInRange = (
  price: number,
  minPrice: number,
  maxPrice: number
): boolean => {
  return price >= minPrice && price <= maxPrice;
};

export const getPriceDifference = (price1: number, price2: number): number => {
  return Math.abs(price1 - price2);
};

export const getPriceDifferencePercentage = (
  price1: number,
  price2: number
): number => {
  if (price2 === 0) return 0;
  return ((price1 - price2) / price2) * 100;
};

// Competition pricing helpers
export const calculateTicketTotal = (
  ticketPrice: number,
  quantity: number
): number => {
  return ticketPrice * quantity;
};

export const calculateCompetitionRevenue = (
  ticketPrice: number,
  soldTickets: number
): number => {
  return ticketPrice * soldTickets;
};

export const calculateCompetitionProfit = (
  revenue: number,
  prizeValue: number,
  expenses: number = 0
): number => {
  return revenue - prizeValue - expenses;
};

export const calculateCompetitionMargin = (
  revenue: number,
  prizeValue: number
): number => {
  if (revenue === 0) return 0;
  return ((revenue - prizeValue) / revenue) * 100;
};

// Price validation helpers
export const isValidPrice = (price: number): boolean => {
  return price >= 0 && !isNaN(price) && isFinite(price);
};

export const isValidPriceRange = (
  minPrice: number,
  maxPrice: number
): boolean => {
  return (
    isValidPrice(minPrice) && isValidPrice(maxPrice) && minPrice <= maxPrice
  );
};

// Currency conversion helpers (placeholder - would need real exchange rates)
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number => {
  // This is a placeholder implementation
  // In a real app, you'd use a currency conversion API
  const exchangeRates: Record<string, Record<string, number>> = {
    GBP: { USD: 1.27, EUR: 1.17 },
    USD: { GBP: 0.79, EUR: 0.92 },
    EUR: { GBP: 0.85, USD: 1.09 },
  };

  if (fromCurrency === toCurrency) {
    return amount;
  }

  const rate = exchangeRates[fromCurrency]?.[toCurrency];
  if (!rate) {
    throw new Error(
      `Exchange rate not found for ${fromCurrency} to ${toCurrency}`
    );
  }

  return amount * rate;
};

// Price display helpers
export const formatPriceWithCurrency = (
  price: number,
  currency: string = CURRENCY.CODE
): string => {
  const symbol =
    currency === "GBP"
      ? "£"
      : currency === "USD"
      ? "$"
      : currency === "EUR"
      ? "€"
      : currency;

  const formatted = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: CURRENCY.DECIMAL_PLACES,
    maximumFractionDigits: CURRENCY.DECIMAL_PLACES,
  }).format(price);

  return `${symbol}${formatted}`;
};

export const formatPriceForDisplay = (
  price: number,
  options: {
    showSymbol?: boolean;
    showDecimals?: boolean;
    currency?: string;
  } = {}
): string => {
  const {
    showSymbol = true,
    showDecimals = true,
    currency = CURRENCY.CODE,
  } = options;

  const formatted = new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: showDecimals ? CURRENCY.DECIMAL_PLACES : 0,
    maximumFractionDigits: showDecimals ? CURRENCY.DECIMAL_PLACES : 0,
  }).format(price);

  if (!showSymbol) {
    return formatted;
  }

  const symbol =
    currency === "GBP"
      ? "£"
      : currency === "USD"
      ? "$"
      : currency === "EUR"
      ? "€"
      : currency;
  return `${symbol}${formatted}`;
};

// Price sorting helpers
export const sortByPrice = <T extends { price: number }>(
  items: T[],
  direction: "asc" | "desc" = "asc"
): T[] => {
  return [...items].sort((a, b) => {
    return direction === "asc" ? a.price - b.price : b.price - a.price;
  });
};

export const filterByPriceRange = <T extends { price: number }>(
  items: T[],
  minPrice: number,
  maxPrice: number
): T[] => {
  return items.filter((item) => isPriceInRange(item.price, minPrice, maxPrice));
};
