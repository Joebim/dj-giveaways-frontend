/**
 * Format price to UK currency format (£)
 */
export const formatPrice = (price: number, showDecimals: boolean = true): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(price);
};

/**
 * Format large numbers with commas
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-GB').format(num);
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (originalPrice: number, discountedPrice: number): number => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

/**
 * Calculate VAT (20% UK standard rate)
 */
export const calculateVAT = (price: number, rate: number = 0.2): number => {
  return price * rate;
};

/**
 * Format price with VAT included
 */
export const formatPriceWithVAT = (price: number, showVAT: boolean = true): string => {
  const vat = calculateVAT(price);
  const total = price + vat;
  
  if (showVAT) {
    return `${formatPrice(total)} (incl. ${formatPrice(vat)} VAT)`;
  }
  
  return formatPrice(total);
};

/**
 * Parse price string to number
 */
export const parsePrice = (price: string): number => {
  return parseFloat(price.replace(/[£,\s]/g, ''));
};

