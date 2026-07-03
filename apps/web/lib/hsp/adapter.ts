import type {
  CreateIntentInput,
  HspMode,
  HspPaymentIntent,
} from "./types";
import { getHspMode } from "./config";
import { mockHspAdapter } from "./mock-adapter";
import { hspAdapter } from "./hsp-adapter";

/**
 * The single interface every HSP provider must implement. UI/service talk only
 * to this — swapping providers means swapping the adapter, nothing else.
 */
export interface HspAdapter {
  readonly mode: HspMode;
  createPaymentIntent(input: CreateIntentInput): Promise<HspPaymentIntent>;
  /** Move an intent toward settlement (wallet payment / provider flow). */
  startPayment(intentId: string): Promise<HspPaymentIntent>;
  getPaymentStatus(intentId: string): Promise<HspPaymentIntent | null>;
  isPremiumUnlocked(scanId: string, walletAddress: string): Promise<boolean>;
}

/** Returns the active adapter based on NEXT_PUBLIC_HSP_MODE. */
export function getAdapter(): HspAdapter {
  return getHspMode() === "mock" ? mockHspAdapter : hspAdapter;
}
