import type { HspMode, PremiumProduct } from "./types";

/**
 * HSP mode. The mock adapter is ONLY active when NEXT_PUBLIC_HSP_MODE=mock.
 * Any other value (or unset) selects the real adapter (skeleton).
 */
export function getHspMode(): HspMode {
  return process.env.NEXT_PUBLIC_HSP_MODE === "mock" ? "mock" : "hsp";
}

export function isMockMode(): boolean {
  return getHspMode() === "mock";
}

export const PREMIUM_PRICE =
  process.env.NEXT_PUBLIC_PREMIUM_REPORT_PRICE?.trim() || "25";

export const PREMIUM_CURRENCY =
  process.env.NEXT_PUBLIC_PREMIUM_REPORT_CURRENCY?.trim() || "HSP";

/** Build the premium product descriptor for a given scan. */
export function getPremiumProduct(scanId: string): PremiumProduct {
  return {
    id: "premium-risk-report",
    name: "Premium Risk Report",
    description:
      "Full AI analysis, complete risk indicators, downloadable JSON, and an on-chain verification link.",
    amount: PREMIUM_PRICE,
    currency: PREMIUM_CURRENCY,
    scanId,
  };
}

export const PREMIUM_BENEFITS = [
  "Full AI Report",
  "Full Risk Indicators",
  "Downloadable JSON",
  "On-Chain Verification Link",
] as const;
