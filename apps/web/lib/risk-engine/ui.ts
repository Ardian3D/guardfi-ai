import type { RiskLevel as UiRiskLevel } from "@/lib/mock";
import type { RiskLevel, Severity } from "./types";

/** Map engine risk level → the UI RiskLevel used by shared components. */
export function toUiRiskLevel(level: RiskLevel): UiRiskLevel {
  switch (level) {
    case "LOW":
      return "Low";
    case "MODERATE":
      return "Medium";
    case "HIGH":
      return "High";
    case "CRITICAL":
      return "Critical";
    default:
      return "Info";
  }
}

/** Map indicator severity → the UI RiskLevel used by shared components. */
export function severityToUiLevel(severity: Severity): UiRiskLevel {
  switch (severity) {
    case "LOW":
      return "Low";
    case "MEDIUM":
      return "Medium";
    case "HIGH":
      return "High";
    case "CRITICAL":
      return "Critical";
    default:
      return "Info";
  }
}

/** Map severity → Badge tone. */
export function severityToTone(
  severity: Severity
): "low" | "medium" | "high" | "critical" {
  return severity.toLowerCase() as "low" | "medium" | "high" | "critical";
}
