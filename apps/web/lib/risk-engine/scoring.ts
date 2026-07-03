import type { RiskIndicator, RiskLevel } from "./types";
import { SEVERITY_WEIGHTS } from "./constants";

/**
 * Deterministic score: sum of severity weights, capped at 100 (task §6).
 *   CRITICAL +25, HIGH +15, MEDIUM +8, LOW +3
 */
export function computeScore(indicators: RiskIndicator[]): number {
  const total = indicators.reduce(
    (sum, indicator) => sum + (SEVERITY_WEIGHTS[indicator.severity] ?? 0),
    0
  );
  return Math.min(total, 100);
}

/**
 * Risk level mapping (task §6):
 *   0–20 LOW · 21–50 MODERATE · 51–75 HIGH · 76–100 CRITICAL
 */
export function mapRiskLevel(score: number): RiskLevel {
  if (score <= 20) return "LOW";
  if (score <= 50) return "MODERATE";
  if (score <= 75) return "HIGH";
  return "CRITICAL";
}
