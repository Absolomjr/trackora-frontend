import { CURRENCY } from "./constants";

/**
 * Formats a numeric value as the store currency (UGX by default).
 * Accepts numbers or numeric strings (DRF often returns decimals as strings).
 */
export default function formatCurrency(value, currency = CURRENCY) {
  const number = Number(value);
  if (value === null || value === undefined || Number.isNaN(number)) {
    return `${currency} 0`;
  }

  const formatted = new Intl.NumberFormat("en-UG", {
    maximumFractionDigits: 0,
  }).format(number);

  return `${currency} ${formatted}`;
}
