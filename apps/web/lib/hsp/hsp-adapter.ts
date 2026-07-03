"use client";

import type { HspAdapter } from "./adapter";
import type { CreateIntentInput, HspPaymentIntent } from "./types";
import { isUnlockedLocal } from "./storage";

const NOT_CONFIGURED = "HSP adapter is not configured.";

/**
 * Real HSP adapter — SKELETON. Wire this to the official HSP SDK / API when
 * available. IMPORTANT:
 *  - Do NOT put HSP_API_KEY / secrets in this client file.
 *  - HSP operations that need secrets must go through a server-side API route
 *    (e.g. app/api/hsp/intent/route.ts) which reads HSP_API_KEY / HSP_API_BASE_URL
 *    from the server environment and returns a safe intent/status to the client.
 *  - This adapter should call those routes; it must never call HSP directly
 *    with a secret from the browser.
 *
 * Until wired, every mutating method throws "HSP adapter is not configured."
 * so the UI can show a clear message. Reads fall back to local unlock state.
 */
export const hspAdapter: HspAdapter = {
  mode: "hsp",

  async createPaymentIntent(_input: CreateIntentInput): Promise<HspPaymentIntent> {
    throw new Error(NOT_CONFIGURED);
  },

  async startPayment(_intentId: string): Promise<HspPaymentIntent> {
    throw new Error(NOT_CONFIGURED);
  },

  async getPaymentStatus(_intentId: string): Promise<HspPaymentIntent | null> {
    return null;
  },

  async isPremiumUnlocked(scanId: string, walletAddress: string): Promise<boolean> {
    // A production build would verify settlement server-side; for now, reflect
    // any locally-recorded unlock so a real settlement recorded elsewhere shows.
    return isUnlockedLocal(scanId, walletAddress);
  },
};

export { NOT_CONFIGURED };
