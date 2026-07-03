import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  getHspMode,
  isMockMode,
  PREMIUM_PRICE,
  PREMIUM_CURRENCY,
  getPremiumProduct,
} from "./config";
import { mockHspAdapter } from "./mock-adapter";
import { hspAdapter } from "./hsp-adapter";
import {
  savePremiumUnlock,
  getPremiumUnlock,
  isUnlockedLocal,
} from "./storage";
import { createIntent, settleIntent, isUnlocked } from "./service";
import type { PremiumUnlock } from "./types";

/** Minimal in-memory localStorage + window polyfill for the node test env. */
class MemStorage {
  private store = new Map<string, string>();
  getItem(k: string) {
    return this.store.has(k) ? this.store.get(k)! : null;
  }
  setItem(k: string, v: string) {
    this.store.set(k, String(v));
  }
  removeItem(k: string) {
    this.store.delete(k);
  }
  clear() {
    this.store.clear();
  }
  key(i: number) {
    return Array.from(this.store.keys())[i] ?? null;
  }
  get length() {
    return this.store.size;
  }
}

const WALLET_A = "0xAAaAAaAAaAAaAAaAAaAAaAAaAAaAAaAAaAAaAAaA";
const WALLET_B = "0xBBbBBbBBbBBbBBbBBbBBbBBbBBbBBbBBbBBbBBbB";

beforeEach(() => {
  const ls = new MemStorage();
  (globalThis as unknown as { window: unknown }).window = { localStorage: ls };
  (globalThis as unknown as { localStorage: unknown }).localStorage = ls;
  delete process.env.NEXT_PUBLIC_HSP_MODE;
});

afterEach(() => {
  delete (globalThis as Record<string, unknown>).window;
  delete (globalThis as Record<string, unknown>).localStorage;
  delete process.env.NEXT_PUBLIC_HSP_MODE;
});

describe("config", () => {
  it("reads NEXT_PUBLIC_HSP_MODE=mock", () => {
    process.env.NEXT_PUBLIC_HSP_MODE = "mock";
    expect(getHspMode()).toBe("mock");
    expect(isMockMode()).toBe(true);
  });

  it("defaults to real (hsp) mode when unset", () => {
    expect(getHspMode()).toBe("hsp");
    expect(isMockMode()).toBe(false);
  });

  it("exposes default price and currency", () => {
    expect(PREMIUM_PRICE).toBe("25");
    expect(PREMIUM_CURRENCY).toBe("HSP");
    const product = getPremiumProduct("scan_x");
    expect(product.amount).toBe("25");
    expect(product.currency).toBe("HSP");
    expect(product.scanId).toBe("scan_x");
  });
});

describe("mock adapter", () => {
  it("createPaymentIntent returns a CREATED intent with all fields", async () => {
    const intent = await mockHspAdapter.createPaymentIntent({
      scanId: "scan_1",
      walletAddress: WALLET_A,
      product: getPremiumProduct("scan_1"),
    });
    expect(intent.status).toBe("CREATED");
    expect(intent.scanId).toBe("scan_1");
    expect(intent.walletAddress).toBe(WALLET_A);
    expect(intent.amount).toBe("25");
    expect(intent.currency).toBe("HSP");
    expect(intent.intentId).toBeTruthy();
  });

  it("startPayment goes PENDING then SETTLED with a mock txHash", async () => {
    const intent = await mockHspAdapter.createPaymentIntent({
      scanId: "scan_2",
      walletAddress: WALLET_A,
      product: getPremiumProduct("scan_2"),
    });

    const pending = mockHspAdapter.startPayment(intent.intentId); // don't await yet
    const mid = await mockHspAdapter.getPaymentStatus(intent.intentId);
    expect(mid?.status).toBe("PENDING");

    const settled = await pending;
    expect(settled.status).toBe("SETTLED");
    expect(settled.txHash).toMatch(/^0xmock/);
    expect(settled.settledAt).toBeTruthy();
  });

  it("records unlock after settlement", async () => {
    const intent = await mockHspAdapter.createPaymentIntent({
      scanId: "scan_3",
      walletAddress: WALLET_A,
      product: getPremiumProduct("scan_3"),
    });
    await mockHspAdapter.startPayment(intent.intentId);
    expect(await mockHspAdapter.isPremiumUnlocked("scan_3", WALLET_A)).toBe(true);
  });
});

describe("storage", () => {
  function unlock(scanId: string, wallet: string): PremiumUnlock {
    return {
      scanId,
      walletAddress: wallet,
      status: "UNLOCKED",
      source: "mock",
      unlockedAt: new Date().toISOString(),
      paymentIntentId: "hspint_test",
    };
  }

  it("saves and reads unlock by scanId + wallet", () => {
    savePremiumUnlock(unlock("scan_s", WALLET_A));
    expect(getPremiumUnlock("scan_s", WALLET_A)?.status).toBe("UNLOCKED");
    expect(isUnlockedLocal("scan_s", WALLET_A)).toBe(true);
  });

  it("does not unlock a different wallet", () => {
    savePremiumUnlock(unlock("scan_s", WALLET_A));
    expect(getPremiumUnlock("scan_s", WALLET_B)).toBeNull();
    expect(isUnlockedLocal("scan_s", WALLET_B)).toBe(false);
  });

  it("is case-insensitive on wallet address", () => {
    savePremiumUnlock(unlock("scan_s", WALLET_A.toLowerCase()));
    expect(isUnlockedLocal("scan_s", WALLET_A.toUpperCase())).toBe(true);
  });

  it("overwrite updates the stored unlock", () => {
    savePremiumUnlock(unlock("scan_s", WALLET_A));
    const updated = { ...unlock("scan_s", WALLET_A), txHash: "0xabc" };
    savePremiumUnlock(updated);
    expect(getPremiumUnlock("scan_s", WALLET_A)?.txHash).toBe("0xabc");
  });
});

describe("service (mock mode)", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_HSP_MODE = "mock";
  });

  it("unlocks premium and reports UNLOCKED for same wallet only", async () => {
    const intent = await createIntent("scan_svc", WALLET_A);
    const settled = await settleIntent(intent.intentId);
    expect(settled.status).toBe("SETTLED");

    expect(isUnlocked("scan_svc", WALLET_A)).toBe(true);
    expect(isUnlocked("scan_svc", WALLET_B)).toBe(false);
    expect(isUnlocked("scan_svc", undefined)).toBe(false);
  });
});

describe("real adapter skeleton (not configured)", () => {
  it("throws a clear error for mutating operations", async () => {
    await expect(
      hspAdapter.createPaymentIntent({
        scanId: "scan_r",
        walletAddress: WALLET_A,
        product: getPremiumProduct("scan_r"),
      })
    ).rejects.toThrow("HSP adapter is not configured.");

    await expect(hspAdapter.startPayment("x")).rejects.toThrow(
      "HSP adapter is not configured."
    );
  });

  it("service surfaces the not-configured error in real mode", async () => {
    // real mode (mode !== mock)
    await expect(createIntent("scan_r2", WALLET_A)).rejects.toThrow(
      "HSP adapter is not configured."
    );
  });
});
