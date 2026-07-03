import type { RiskLevel, ScanType } from "../risk-engine/types";
import type { HspMode, UnlockStatus } from "../hsp/types";

export interface DashboardSummary {
  walletAddress?: string;
  totalScans: number;
  totalAiReports: number;
  totalOnChainSubmissions: number;
  totalPremiumUnlocks: number;
  highRiskCount: number;
  criticalRiskCount: number;
  latestScanAt?: string;
  latestSubmissionAt?: string;
}

export interface DashboardRecentScan {
  scanId: string;
  targetAddress: string;
  scanType: ScanType;
  riskScore: number;
  riskLevel: RiskLevel;
  createdAt: string;
  hasAiReport: boolean;
  hasOnChainSubmission: boolean;
  isPremiumUnlocked: boolean;
}

export interface DashboardSubmission {
  scanId: string;
  reportId?: string;
  targetAddress?: string;
  txHash: string;
  reportHash: string;
  metadataURI: string;
  submittedAt?: string;
  explorerUrl: string;
}

export interface DashboardPremiumUnlock {
  scanId: string;
  walletAddress: string;
  status: UnlockStatus;
  source: HspMode;
  unlockedAt: string;
  paymentIntentId: string;
  txHash?: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  recentScans: DashboardRecentScan[];
  submissions: DashboardSubmission[];
  premiumUnlocks: DashboardPremiumUnlock[];
}
