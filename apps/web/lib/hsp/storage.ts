"use client";

import type { HspPaymentIntent, PremiumUnlock } from "./types";

/**
 * SECURITY / MVP NOTE:
 * Unlock status is stored in localStorage keyed by scanId + walletAddress.
 * This is a DEV/MVP convenience only. In production, payment settlement MUST
 * be verified server-side (or on-chain via the HSP provider) before granting
 * access — localStorage can be edited by the user. Do NOT use mock mode in
 * production. Unlock is per-wallet, never global.
 */

const UNLOCK_PREFIX = "guardfi:premium:";
const INTENT_PREFIX = "guardfi:hspintent:";

function unlockKey(scanId: string, wallet: string): string {
  return `${UNLOCK_PREFIX}${scanId}:${wallet.toLowerCase()}`;
}

export function savePremiumUnlock(unlock: PremiumUnlock): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      unlockKey(unlock.scanId, unlock.walletAddress),
      JSON.stringify(unlock)
    );
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export function getPremiumUnlock(
  scanId: string,
  wallet: string
): PremiumUnlock | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(unlockKey(scanId, wallet));
    return raw ? (JSON.parse(raw) as PremiumUnlock) : null;
  } catch {
    return null;
  }
}

export function isUnlockedLocal(scanId: string, wallet: string): boolean {
  return getPremiumUnlock(scanId, wallet)?.status === "UNLOCKED";
}

/* ---- payment intents (used by the mock adapter) ---- */

export function saveIntent(intent: HspPaymentIntent): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      `${INTENT_PREFIX}${intent.intentId}`,
      JSON.stringify(intent)
    );
  } catch {
    /* ignore */
  }
}

export function getIntent(intentId: string): HspPaymentIntent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${INTENT_PREFIX}${intentId}`);
    return raw ? (JSON.parse(raw) as HspPaymentIntent) : null;
  } catch {
    return null;
  }
}
