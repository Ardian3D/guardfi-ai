import type { ScanResult, Severity } from "../risk-engine/types";
import { AI_REPORT_VERSION, type AiReport, type AiKeyFinding } from "./types";
import { buildFallbackReport } from "./fallback";

const MAX_FINDINGS = 8;
const MAX_ACTIONS = 8;
const VALID_SEVERITIES: Severity[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

/** Replace forbidden/overclaiming phrases with safe wording. */
const FORBIDDEN: { re: RegExp; replacement: string }[] = [
  { re: /guaranteed\s+safe/gi, replacement: "low apparent risk" },
  { re: /certified\s+audit/gi, replacement: "automated risk analysis" },
  { re: /formal\s+audit/gi, replacement: "automated risk analysis (not an audit)" },
  { re: /financial\s+advice/gi, replacement: "informational only" },
];

export function sanitizeText(input: unknown): string {
  let text = typeof input === "string" ? input : "";
  for (const { re, replacement } of FORBIDDEN) {
    text = text.replace(re, replacement);
  }
  return text.trim();
}

function coerceSeverity(value: unknown): Severity {
  const upper = typeof value === "string" ? value.toUpperCase() : "";
  return (VALID_SEVERITIES as string[]).includes(upper)
    ? (upper as Severity)
    : "MEDIUM";
}

function stringArray(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => sanitizeText(v))
    .filter((v) => v.length > 0)
    .slice(0, max);
}

function parseFindings(value: unknown): AiKeyFinding[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((f): f is Record<string, unknown> => !!f && typeof f === "object")
    .slice(0, MAX_FINDINGS)
    .map((f) => ({
      title: sanitizeText(f.title) || "Untitled finding",
      severity: coerceSeverity(f.severity),
      explanation: sanitizeText(f.explanation),
      evidence: sanitizeText(f.evidence),
      recommendation: sanitizeText(f.recommendation),
    }));
}

/**
 * Parse and validate a DeepSeek JSON string into an AiReport.
 * - Fills missing fields from the deterministic fallback.
 * - Caps arrays and sanitizes forbidden claims.
 * - Returns null only when the payload is not parseable JSON / not an object,
 *   so the caller can use the full fallback report instead.
 */
export function parseAiReport(
  raw: string,
  scan: ScanResult,
  meta: { provider: string; model: string }
): AiReport | null {
  let obj: unknown;
  try {
    obj = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!obj || typeof obj !== "object") return null;

  const data = obj as Record<string, unknown>;
  const defaults = buildFallbackReport(scan);

  const executiveSummary =
    sanitizeText(data.executiveSummary) || defaults.executiveSummary;
  const riskExplanation =
    sanitizeText(data.riskExplanation) || defaults.riskExplanation;

  let keyFindings = parseFindings(data.keyFindings);
  if (keyFindings.length === 0) keyFindings = defaults.keyFindings;

  let recommendedActions = stringArray(data.recommendedActions, MAX_ACTIONS);
  if (recommendedActions.length === 0)
    recommendedActions = defaults.recommendedActions;

  const technicalNotes =
    sanitizeText(data.technicalNotes) || defaults.technicalNotes;

  let limitations = stringArray(data.limitations, MAX_ACTIONS);
  if (limitations.length === 0) limitations = defaults.limitations;

  const disclaimer = sanitizeText(data.disclaimer) || defaults.disclaimer;

  return {
    reportVersion: AI_REPORT_VERSION,
    provider: meta.provider,
    model: meta.model,
    generatedAt: new Date().toISOString(),
    executiveSummary,
    riskExplanation,
    keyFindings,
    recommendedActions,
    technicalNotes,
    limitations,
    disclaimer,
  };
}
