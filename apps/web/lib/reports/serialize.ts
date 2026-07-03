import type { ScanResult } from "../risk-engine/types";
import {
  REPORT_PAYLOAD_VERSION,
  type ReportPayload,
  type ReportPayloadIndicator,
} from "./types";

/**
 * Build a deterministic report payload from a ScanResult.
 * Indicators are sorted by code so the output is stable regardless of
 * insertion order. Volatile fields (timestamps) are intentionally excluded
 * so the same scan always hashes to the same value.
 */
export function buildReportPayload(scan: ScanResult): ReportPayload {
  const indicators: ReportPayloadIndicator[] = scan.riskIndicators
    .map((i) => ({
      code: i.code,
      severity: i.severity,
      title: i.title,
      evidence: i.evidence,
      confidence: i.confidence,
    }))
    .sort((a, b) => a.code.localeCompare(b.code));

  return {
    payloadVersion: REPORT_PAYLOAD_VERSION,
    scanId: scan.scanId,
    chainId: scan.chainId,
    scanType: scan.scanType,
    target: scan.targetAddress,
    riskScore: scan.riskScore,
    riskLevel: scan.riskLevel,
    rulesetVersion: scan.rulesetVersion,
    tokenName: scan.metadata.tokenName ?? null,
    tokenSymbol: scan.metadata.tokenSymbol ?? null,
    indicators,
  };
}

/**
 * Deterministic JSON: object keys are sorted recursively so the string form
 * is stable across engines/runs. Arrays keep their order.
 */
export function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }
  if (value !== null && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return Object.keys(obj)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeys(obj[key]);
        return acc;
      }, {});
  }
  return value;
}
