/**
 * Core data types for the GuardFi AI risk engine (Phase 4).
 * Deterministic, rule-based. No AI, no database, no on-chain writes here.
 */

export type ScanType = "TOKEN" | "CONTRACT";

/** Indicator severity. */
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/** How confident we are in a best-effort detection. */
export type Confidence = "LOW" | "MEDIUM" | "HIGH";

/** Overall risk level derived from the score (see scoring.ts). */
export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type ScanStatus = "COMPLETED" | "FAILED";

/** For fields that may be unknowable from on-chain data alone. */
export type TriState = true | false | "unknown";

export interface ScanRequest {
  walletAddress?: string;
  targetAddress: string;
  chainId: number;
  scanType: ScanType;
}

export interface ContractMetadata {
  targetAddress: string;
  chainId: number;
  isContract: boolean;
  /** Runtime bytecode size in bytes. */
  bytecodeSize: number;
  tokenName?: string;
  tokenSymbol?: string;
  decimals?: number;
  /** Stringified to survive JSON / avoid BigInt serialization issues. */
  totalSupply?: string;
  /** Source verification is not resolvable from on-chain data alone. */
  sourceVerified: TriState;
  proxyDetected: boolean | "unknown";
  detectedSelectors: string[];
  /** ISO timestamp. */
  scanTime: string;
  /** True when the result is a labeled sample (no live RPC read). */
  demoMode?: boolean;
}

export interface RiskIndicator {
  code: string;
  severity: Severity;
  title: string;
  description: string;
  evidence: string;
  confidence: Confidence;
}

export interface ScanResult {
  scanId: string;
  targetAddress: string;
  chainId: number;
  scanType: ScanType;
  status: ScanStatus;
  metadata: ContractMetadata;
  riskScore: number;
  riskLevel: RiskLevel;
  riskIndicators: RiskIndicator[];
  /** Placeholder only — real AI report generation is a later phase. */
  aiSummaryPreview: string;
  rulesetVersion: string;
  createdAt: string;
}
