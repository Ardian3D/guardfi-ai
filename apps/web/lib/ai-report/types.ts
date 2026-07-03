import type { ScanResult, Severity } from "../risk-engine/types";

/** Bump when the AI report shape changes. Independent of report-hash version. */
export const AI_REPORT_VERSION = "1";

export type AiSeverity = Severity; // LOW | MEDIUM | HIGH | CRITICAL

export interface AiKeyFinding {
  title: string;
  severity: AiSeverity;
  explanation: string;
  evidence: string;
  recommendation: string;
}

/**
 * The full AI risk report. Off-chain only — never part of the on-chain
 * commitment or the Phase 5 report hash.
 */
export interface AiReport {
  reportVersion: string;
  provider: string; // "deepseek" | "guardfi-fallback"
  model: string;
  generatedAt: string; // ISO
  executiveSummary: string;
  riskExplanation: string;
  keyFindings: AiKeyFinding[];
  recommendedActions: string[];
  technicalNotes: string;
  limitations: string[];
  disclaimer: string;
}

export interface AiReportRequest {
  scanResult: ScanResult;
}

export interface AiReportResponse {
  aiReport: AiReport;
  source: "deepseek" | "fallback";
}
