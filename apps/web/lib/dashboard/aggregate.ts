import type { ScanResult } from "../risk-engine/types";
import type { ReportSubmission } from "../reports/types";
import type { PremiumUnlock } from "../hsp/types";
import { explorerTxUrl } from "../contracts/registry";
import type {
  DashboardData,
  DashboardPremiumUnlock,
  DashboardRecentScan,
  DashboardSubmission,
  DashboardSummary,
} from "./types";
import {
  getAllScanResults,
  getAllReportSubmissions,
  getAllAiReportScanIds,
  getAllPremiumUnlocks,
} from "./storage-readers";

export interface AggregateInput {
  wallet?: string;
  scans: ScanResult[];
  submissions: ReportSubmission[];
  aiReportScanIds: string[];
  unlocks: PremiumUnlock[];
}

function maxIso(a?: string, b?: string): string | undefined {
  if (!a) return b;
  if (!b) return a;
  return a > b ? a : b;
}

/**
 * PURE aggregator — no storage/DOM access, fully testable.
 * - Scans / submissions / AI reports are per-browser (they carry no wallet).
 * - Premium unlocks ARE filtered by the connected wallet (case-insensitive).
 */
export function aggregateDashboard(input: AggregateInput): DashboardData {
  const { wallet, scans, submissions, aiReportScanIds, unlocks } = input;
  const walletLower = wallet?.toLowerCase();

  const aiSet = new Set(aiReportScanIds);
  const submittedByScan = new Map<string, ReportSubmission>();
  for (const s of submissions) {
    if (s.status === "SUBMITTED" && s.txHash) submittedByScan.set(s.scanId, s);
  }

  // Premium unlocks for the connected wallet only.
  const walletUnlocks = walletLower
    ? unlocks.filter(
        (u) => u.walletAddress.toLowerCase() === walletLower && u.status === "UNLOCKED"
      )
    : [];
  const unlockedScanIds = new Set(walletUnlocks.map((u) => u.scanId));

  const recentScans: DashboardRecentScan[] = [...scans]
    .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
    .map((s) => ({
      scanId: s.scanId,
      targetAddress: s.targetAddress,
      scanType: s.scanType,
      riskScore: s.riskScore,
      riskLevel: s.riskLevel,
      createdAt: s.createdAt,
      hasAiReport: aiSet.has(s.scanId),
      hasOnChainSubmission: submittedByScan.has(s.scanId),
      isPremiumUnlocked: unlockedScanIds.has(s.scanId),
    }));

  const dashSubmissions: DashboardSubmission[] = submissions
    .filter((s) => s.status === "SUBMITTED" && !!s.txHash)
    .sort((a, b) => (maxIso(a.submittedAt, b.submittedAt) === a.submittedAt ? -1 : 1))
    .map((s) => ({
      scanId: s.scanId,
      reportId: s.reportId,
      targetAddress: s.target,
      txHash: s.txHash as string,
      reportHash: s.reportHash,
      metadataURI: s.metadataURI,
      submittedAt: s.submittedAt,
      explorerUrl: explorerTxUrl(s.txHash as string),
    }));

  const premiumUnlocks: DashboardPremiumUnlock[] = walletUnlocks
    .sort((a, b) => (a.unlockedAt > b.unlockedAt ? -1 : 1))
    .map((u) => ({
      scanId: u.scanId,
      walletAddress: u.walletAddress,
      status: u.status,
      source: u.source,
      unlockedAt: u.unlockedAt,
      paymentIntentId: u.paymentIntentId,
      txHash: u.txHash,
    }));

  const summary: DashboardSummary = {
    walletAddress: wallet,
    totalScans: scans.length,
    totalAiReports: aiReportScanIds.length,
    totalOnChainSubmissions: submittedByScan.size,
    totalPremiumUnlocks: walletUnlocks.length,
    highRiskCount: scans.filter((s) => s.riskLevel === "HIGH").length,
    criticalRiskCount: scans.filter((s) => s.riskLevel === "CRITICAL").length,
    latestScanAt: scans.reduce<string | undefined>(
      (acc, s) => maxIso(acc, s.createdAt),
      undefined
    ),
    latestSubmissionAt: dashSubmissions.reduce<string | undefined>(
      (acc, s) => maxIso(acc, s.submittedAt),
      undefined
    ),
  };

  return { summary, recentScans, submissions: dashSubmissions, premiumUnlocks };
}

/** Reads all local storage and aggregates for the given wallet. */
export function buildDashboard(wallet?: string): DashboardData {
  return aggregateDashboard({
    wallet,
    scans: getAllScanResults(),
    submissions: getAllReportSubmissions(),
    aiReportScanIds: getAllAiReportScanIds(),
    unlocks: getAllPremiumUnlocks(),
  });
}
