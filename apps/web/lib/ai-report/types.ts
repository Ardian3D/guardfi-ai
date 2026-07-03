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

/**
 * Specific reason the deterministic fallback was used instead of DeepSeek.
 * Server-side diagnostics only; never contains secrets.
 */
export type AiReportFallbackReason =
  | "missing_api_key"
  | "deepseek_http_error"
  | "deepseek_timeout"
  | "empty_content"
  | "invalid_json"
  | "parser_validation_failed"
  | "forbidden_claim_sanitized"
  | "unknown_error";

/**
 * Safe generation diagnostics. Contains no secrets (no API key, no headers,
 * no error stacks). Exposed to the client only in non-production.
 */
export interface AiReportGenerationDebug {
  source: "deepseek" | "fallback";
  fallbackReason?: AiReportFallbackReason;
  deepseekStatus?: number;
  model?: string;
}

export interface AiReportResponse {
  aiReport: AiReport;
  source: "deepseek" | "fallback";
  /** Present only in non-production responses (see the API route). */
  debug?: AiReportGenerationDebug;
}
