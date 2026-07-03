import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { aggregateDashboard } from "./aggregate";
import { getAllScanResults, getAllPremiumUnlocks } from "./storage-readers";
import type { ScanResult, RiskLevel } from "../risk-engine/types";
import type { ReportSubmission } from "../reports/types";
import type { PremiumUnlock } from "../hsp/types";

const WALLET_A = "0xAAaAAaAAaAAaAAaAAaAAaAAaAAaAAaAAaAAaAAaA";
const WALLET_B = "0xBBbBBbBBbBBbBBbBBbBBbBBbBBbBBbBBbBBbBBbB";

function scan(id: string, level: RiskLevel, createdAt = "2026-01-01T00:00:00Z"): ScanResult {
  return {
    scanId: id,
    targetAddress: "0x1111111111111111111111111111111111111111",
    chainId: 177,
    scanType: "TOKEN",
    status: "COMPLETED",
    metadata: {
      targetAddress: "0x1111111111111111111111111111111111111111",
      chainId: 177,
      isContract: true,
      bytecodeSize: 100,
      sourceVerified: "unknown",
      proxyDetected: false,
      detectedSelectors: [],
      scanTime: createdAt,
    },
    riskScore: 50,
    riskLevel: level,
    riskIndicators: [],
    aiSummaryPreview: "",
    rulesetVersion: "0.1.0",
    createdAt,
  };
}

function submission(scanId: string, submitted: boolean): ReportSubmission {
  return {
    scanId,
    target: "0x1111111111111111111111111111111111111111",
    score: 50,
    reportHash: "0xhash",
    metadataURI: `guardfi://reports/${scanId}`,
    status: submitted ? "SUBMITTED" : "NOT_SUBMITTED",
    txHash: submitted ? "0xtx" : undefined,
    reportId: submitted ? "1" : undefined,
    submittedAt: submitted ? "2026-01-02T00:00:00Z" : undefined,
  };
}

function unlock(scanId: string, wallet: string): PremiumUnlock {
  return {
    scanId,
    walletAddress: wallet,
    status: "UNLOCKED",
    source: "mock",
    unlockedAt: "2026-01-03T00:00:00Z",
    paymentIntentId: "hspint_1",
  };
}

describe("aggregateDashboard", () => {
  it("returns a zero summary for empty storage", () => {
    const d = aggregateDashboard({
      wallet: WALLET_A,
      scans: [],
      submissions: [],
      aiReportScanIds: [],
      unlocks: [],
    });
    expect(d.summary.totalScans).toBe(0);
    expect(d.summary.totalAiReports).toBe(0);
    expect(d.summary.totalOnChainSubmissions).toBe(0);
    expect(d.summary.totalPremiumUnlocks).toBe(0);
    expect(d.summary.highRiskCount).toBe(0);
    expect(d.summary.criticalRiskCount).toBe(0);
    expect(d.recentScans).toHaveLength(0);
    expect(d.submissions).toHaveLength(0);
    expect(d.premiumUnlocks).toHaveLength(0);
  });

  it("counts scans and high/critical risks", () => {
    const d = aggregateDashboard({
      wallet: WALLET_A,
      scans: [scan("s1", "HIGH"), scan("s2", "CRITICAL"), scan("s3", "LOW")],
      submissions: [],
      aiReportScanIds: [],
      unlocks: [],
    });
    expect(d.summary.totalScans).toBe(3);
    expect(d.summary.highRiskCount).toBe(1);
    expect(d.summary.criticalRiskCount).toBe(1);
    expect(d.recentScans).toHaveLength(3);
  });

  it("counts AI reports and flags scans", () => {
    const d = aggregateDashboard({
      wallet: WALLET_A,
      scans: [scan("s1", "LOW"), scan("s2", "LOW")],
      submissions: [],
      aiReportScanIds: ["s1"],
      unlocks: [],
    });
    expect(d.summary.totalAiReports).toBe(1);
    expect(d.recentScans.find((r) => r.scanId === "s1")!.hasAiReport).toBe(true);
    expect(d.recentScans.find((r) => r.scanId === "s2")!.hasAiReport).toBe(false);
  });

  it("counts only settled submissions and flags scans", () => {
    const d = aggregateDashboard({
      wallet: WALLET_A,
      scans: [scan("s1", "LOW"), scan("s2", "LOW")],
      submissions: [submission("s1", true), submission("s2", false)],
      aiReportScanIds: [],
      unlocks: [],
    });
    expect(d.summary.totalOnChainSubmissions).toBe(1);
    expect(d.submissions).toHaveLength(1);
    expect(d.submissions[0].explorerUrl).toContain("hashkey.blockscout.com/tx/");
    expect(d.recentScans.find((r) => r.scanId === "s1")!.hasOnChainSubmission).toBe(true);
    expect(d.recentScans.find((r) => r.scanId === "s2")!.hasOnChainSubmission).toBe(false);
  });

  it("filters premium unlocks by wallet", () => {
    const input = {
      scans: [scan("s1", "LOW"), scan("s2", "LOW")],
      submissions: [] as ReportSubmission[],
      aiReportScanIds: [] as string[],
      unlocks: [unlock("s1", WALLET_A), unlock("s2", WALLET_B)],
    };

    const dA = aggregateDashboard({ ...input, wallet: WALLET_A });
    expect(dA.summary.totalPremiumUnlocks).toBe(1);
    expect(dA.premiumUnlocks).toHaveLength(1);
    expect(dA.recentScans.find((r) => r.scanId === "s1")!.isPremiumUnlocked).toBe(true);
    expect(dA.recentScans.find((r) => r.scanId === "s2")!.isPremiumUnlocked).toBe(false);

    const dNone = aggregateDashboard({ ...input, wallet: undefined });
    expect(dNone.summary.totalPremiumUnlocks).toBe(0);
  });

  it("matches wallet case-insensitively", () => {
    const d = aggregateDashboard({
      wallet: WALLET_A.toUpperCase(),
      scans: [scan("s1", "LOW")],
      submissions: [],
      aiReportScanIds: [],
      unlocks: [unlock("s1", WALLET_A.toLowerCase())],
    });
    expect(d.summary.totalPremiumUnlocks).toBe(1);
  });
});

describe("storage-readers (corrupt-safe)", () => {
  class MemStorage {
    private store = new Map<string, string>();
    getItem(k: string) {
      return this.store.has(k) ? this.store.get(k)! : null;
    }
    setItem(k: string, v: string) {
      this.store.set(k, String(v));
    }
    key(i: number) {
      return Array.from(this.store.keys())[i] ?? null;
    }
    get length() {
      return this.store.size;
    }
  }

  beforeEach(() => {
    const ss = new MemStorage();
    const ls = new MemStorage();
    (globalThis as Record<string, unknown>).window = {
      sessionStorage: ss,
      localStorage: ls,
    };
  });

  afterEach(() => {
    delete (globalThis as Record<string, unknown>).window;
  });

  it("skips corrupt entries without throwing", () => {
    const w = (globalThis as unknown as { window: { sessionStorage: MemStorage } }).window;
    w.sessionStorage.setItem("guardfi:scan:s1", JSON.stringify(scan("s1", "LOW")));
    w.sessionStorage.setItem("guardfi:scan:bad", "{ not json");
    w.sessionStorage.setItem("unrelated", "x");
    const scans = getAllScanResults();
    expect(scans).toHaveLength(1);
    expect(scans[0].scanId).toBe("s1");
  });

  it("returns empty when no window", () => {
    delete (globalThis as Record<string, unknown>).window;
    expect(getAllPremiumUnlocks()).toEqual([]);
  });
});
