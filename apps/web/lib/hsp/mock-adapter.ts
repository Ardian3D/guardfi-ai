"use client";

import type { HspAdapter } from "./adapter";
import type { CreateIntentInput, HspPaymentIntent, PremiumUnlock } from "./types";
import {
  saveIntent,
  getIntent,
  savePremiumUnlock,
  isUnlockedLocal,
} from "./storage";

function newId(prefix: string): string {
  const rand =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 16)
      : Math.random().toString(16).slice(2, 18);
  return `${prefix}_${rand}`;
}

/**
 * Mock HSP adapter — for local demo/dev ONLY. It simulates the payment
 * lifecycle in the browser; NO real value is transferred. Never present this
 * as a real payment.
 */
export const mockHspAdapter: HspAdapter = {
  mode: "mock",

  async createPaymentIntent(input: CreateIntentInput): Promise<HspPaymentIntent> {
    const intent: HspPaymentIntent = {
      intentId: newId("hspint"),
      scanId: input.scanId,
      productId: input.product.id,
      walletAddress: input.walletAddress,
      amount: input.product.amount,
      currency: input.product.currency,
      status: "CREATED",
      createdAt: new Date().toISOString(),
    };
    saveIntent(intent);
    return intent;
  },

  async startPayment(intentId: string): Promise<HspPaymentIntent> {
    const intent = getIntent(intentId);
    if (!intent) throw new Error("Payment intent not found.");

    // Simulate PENDING → SETTLED with a short delay.
    const pending: HspPaymentIntent = { ...intent, status: "PENDING" };
    saveIntent(pending);
    await new Promise((r) => setTimeout(r, 1400));

    const settled: HspPaymentIntent = {
      ...pending,
      status: "SETTLED",
      settledAt: new Date().toISOString(),
      txHash: `0xmock${newId("").slice(0, 56)}`,
    };
    saveIntent(settled);

    const unlock: PremiumUnlock = {
      scanId: settled.scanId,
      walletAddress: settled.walletAddress,
      status: "UNLOCKED",
      source: "mock",
      unlockedAt: settled.settledAt!,
      paymentIntentId: settled.intentId,
      txHash: settled.txHash,
    };
    savePremiumUnlock(unlock);
    return settled;
  },

  async getPaymentStatus(intentId: string): Promise<HspPaymentIntent | null> {
    return getIntent(intentId);
  },

  async isPremiumUnlocked(scanId: string, walletAddress: string): Promise<boolean> {
    return isUnlockedLocal(scanId, walletAddress);
  },
};
