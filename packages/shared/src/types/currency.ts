export type SupportedCurrency = 'USD' | 'INR';

/**
 * Transparent currency conversion standard.
 * Base catalogue and PayPal Sandbox transactions operate in USD.
 * INR calculations use an explicit, transparent conversion rate (1 USD ≈ 83.5 INR).
 * Never convert silently without disclosing the exchange rate!
 */
export const EXCHANGE_RATES: Record<SupportedCurrency, number> = {
  USD: 1.0,
  INR: 83.5, // 1 USD = 83.5 INR
};

export function convertCurrency(
  amount: number,
  from: SupportedCurrency,
  to: SupportedCurrency
): number {
  if (from === to) return amount;
  const inUsd = from === 'USD' ? amount : amount / EXCHANGE_RATES[from];
  const converted = to === 'USD' ? inUsd : inUsd * EXCHANGE_RATES[to];
  return Math.round(converted * 100) / 100;
}

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = 'USD',
  showCode: boolean = false
): string {
  const symbol = currency === 'INR' ? '₹' : '$';
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: currency === 'INR' ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return showCode ? `${symbol}${formatted} ${currency}` : `${symbol}${formatted}`;
}
