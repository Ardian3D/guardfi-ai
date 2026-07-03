"use client";

import { getAdapter } from "./adapter";
import { getPremiumProduct, getHspMode } from "./config";
import { getPremiumUnlock } from "./storage";
import type { HspMode, HspPaymentIntent, PremiumUnlock } from "./types";

export function hspMode(): HspMode {
  return getHspMode();
}

/** Local unlock lookup (per scanId + wallet). */
export function readUnlock(
  scanId: string,
  wallet: string | undefined
): PremiumUnlock | null {
  if (!wallet) return null;
  return getPremiumUnlock(scanId, wallet);
}

export function isUnlocked(scanId: string, wallet: string | undefined): boolean {
  return readUnlock(scanId, wallet)?.status === "UNLOCKED";
}

/** Create a payment intent for the premium report. */
export async function createIntent(
  scanId: string,
  wallet: string
): Promise<HspPaymentIntent> {
  const adapter = getAdapter();
  return adapter.createPaymentIntent({
    scanId,
    walletAddress: wallet,
    product: getPremiumProduct(scanId),
  });
}

/** Drive a payment intent to settlement. On SETTLED the adapter records unlock. */
export async function settleIntent(
  intentId: string
): Promise<HspPaymentIntent> {
  const adapter = getAdapter();
  return adapter.startPayment(intentId);
}
