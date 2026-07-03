/**
 * HSP (HashKey Settlement/Payment) premium-unlock types.
 * Adapter-based: the app never depends on a concrete HSP SDK directly.
 */

export type HspMode = "mock" | "hsp";

export type PaymentStatus =
  | "CREATED"
  | "PENDING"
  | "SETTLED"
  | "FAILED"
  | "CANCELLED";

export type UnlockStatus = "LOCKED" | "UNLOCKED";

export interface PremiumProduct {
  id: string;
  name: string;
  description: string;
  amount: string; // stringified to avoid float issues
  currency: string;
  /** The scan/report this product unlocks. */
  scanId: string;
}

export interface HspPaymentIntent {
  intentId: string;
  scanId: string;
  productId: string;
  walletAddress: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  settledAt?: string;
  txHash?: string;
}

export interface PremiumUnlock {
  scanId: string;
  walletAddress: string;
  status: UnlockStatus;
  source: HspMode;
  unlockedAt: string;
  paymentIntentId: string;
  txHash?: string;
}

export interface CreateIntentInput {
  scanId: string;
  product: PremiumProduct;
  walletAddress: string;
}
