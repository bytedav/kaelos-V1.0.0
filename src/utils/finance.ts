import { SITE_CONFIG } from '../data/siteConfig';

export const MIN_ENTRANCE_RATIO = SITE_CONFIG.finance.minEntranceRatio;
export const FINANCE_TERMS = SITE_CONFIG.finance.availableTerms;
export const DEFAULT_TERM = SITE_CONFIG.finance.defaultTermMonths;
export const ANNUAL_INTEREST_RATE = SITE_CONFIG.finance.annualInterestRate; // TIN / TEA

export function getMinEntrance(price: number): number {
  return Math.round(price * SITE_CONFIG.finance.minEntranceRatio);
}

// Clamp DURO: nunca permite bajar del mínimo, solo subir
export function clampEntranceFee(price: number, value: number): number {
  const min = getMinEntrance(price);
  const max = Math.max(min, price - 1);
  return Math.min(Math.max(value, min), max);
}

export const PACK_PRICES: Record<string, number> = Object.fromEntries(
  Object.entries(SITE_CONFIG.finance.packs).map(([key, pack]) => [key, pack.price])
);

export const PACK_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(SITE_CONFIG.finance.packs).map(([key, pack]) => [key, pack.name])
);

export function getPackPrice(packKey: string): number {
  return SITE_CONFIG.finance.packs[packKey]?.price ?? 0;
}

export function calculateCuota(price: number, entrance: number, term: number): number {
  const actualEntrance = Math.max(entrance, getMinEntrance(price));
  const amount = Math.max(0, price - actualEntrance);
  if (amount <= 0) return 0;
  const monthlyRate = SITE_CONFIG.finance.annualInterestRate / 12;
  const cuota = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
  return Math.round(cuota);
}

