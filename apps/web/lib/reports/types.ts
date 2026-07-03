import type { Severity, Confidence } from "../risk-engine/types";

/** Report payload version — bump when the payload shape changes. */
export const REPORT_PAYLOAD_VERSION = "1";

/** A single indicator as it appears in the hashed payload (stable subset). */
export interface ReportPayloadIndicator {
  code: string;
  severity: Severity;
  title: string;
  evidence: string;
  confidence: Confidence;
}

/**
 * Deterministic, off-chain report payload. Its keccak256 hash is what gets
 * committed on-chain via submitReport(). Only stable fields are included —
 * no timestamps that would change between rebuilds of the same scan.
 */
export interface ReportPayload {
  payloadVersion: string;
  scanId: string;
  chainId: number;
  scanType: string;
  target: string;
  riskScore: number;
  riskLevel: string;
  rulesetVersion: string;
  tokenName: string | null;
  tokenSymbol: string | null;
  indicators: ReportPayloadIndicator[];
}

export type SubmissionStatus = "NOT_SUBMITTED" | "PENDING" | "SUBMITTED";

/** Local record of an on-chain submission (kept in localStorage). */
export interface ReportSubmission {
  scanId: string;
  target: string;
  score: number;
  reportHash: string;
  metadataURI: string;
  status: SubmissionStatus;
  registryAddress?: string;
  txHash?: string;
  reportId?: string;
  submittedAt?: string;
}
