import type { ScanResult, RiskIndicator, Severity } from "../risk-engine/types";
import { AI_REPORT_VERSION, type AiReport, type AiKeyFinding } from "./types";

const SEVERITY_WEIGHT: Record<Severity, number> = {
  CRITICAL: 4,
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

const RECOMMENDATION_BY_CODE: Record<string, string> = {
  NON_CONTRACT_ADDRESS:
    "Confirm you are using the correct, deployed contract address before interacting.",
  OWNER_PRIVILEGE_DETECTED:
    "Review the owner/admin powers; prefer contracts with timelock or multisig control.",
  MINT_FUNCTION_DETECTED:
    "Check whether minting is restricted or renounced before relying on token supply.",
  BLACKLIST_FUNCTION_DETECTED:
    "Be aware that addresses can be blocked; avoid if you need censorship resistance.",
  PAUSE_FUNCTION_DETECTED:
    "Transfers may be pausable; consider the impact on entering or exiting positions.",
  TRANSFER_TAX_SELECTOR_DETECTED:
    "Confirm the current fees and whether the owner can increase them.",
  PROXY_PATTERN_DETECTED:
    "Contract logic appears upgradeable; monitor upgrades and who controls the admin keys.",
  SOURCE_VERIFICATION_UNKNOWN:
    "Confirm the source is verified on the block explorer before trusting its behavior.",
  TOKEN_METADATA_UNAVAILABLE:
    "Confirm this target is the intended token and standard.",
  BYTECODE_AVAILABLE: "Informational only — no action required.",
};

const DISCLAIMER =
  "This report is automated risk intelligence generated from deterministic signals. It is not a formal audit and not financial advice. Selector detection is best-effort and may produce false positives or false negatives. Always do your own research.";

function summaryForLevel(level: ScanResult["riskLevel"]): string {
  switch (level) {
    case "LOW":
      return "No high-severity signals dominate; apparent risk from the detected signals is low, but absence of signals is not proof of safety.";
    case "MODERATE":
      return "Some elevated signals were detected. Review them before interacting.";
    case "HIGH":
      return "Multiple elevated risk signals were detected. Proceed only with strong caution.";
    case "CRITICAL":
      return "Critical risk signals were detected. Treat this target as high-risk.";
    default:
      return "Review the detected signals before interacting.";
  }
}

function toFinding(indicator: RiskIndicator): AiKeyFinding {
  return {
    title: indicator.title,
    severity: indicator.severity,
    explanation: indicator.description,
    evidence: indicator.evidence,
    recommendation:
      RECOMMENDATION_BY_CODE[indicator.code] ?? "Review this signal manually.",
  };
}

/** Deterministic report built purely from the scan result — no network calls. */
export function buildFallbackReport(scan: ScanResult): AiReport {
  const sorted = [...scan.riskIndicators].sort(
    (a, b) => SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity]
  );
  const keyFindings = sorted.slice(0, 6).map(toFinding);

  const severities = new Set(scan.riskIndicators.map((i) => i.severity));
  const recommendedActions: string[] = [];
  if (severities.has("CRITICAL") || severities.has("HIGH")) {
    recommendedActions.push(
      "Do not commit significant funds until the high-severity signals are understood."
    );
  }
  if (scan.metadata.proxyDetected === true) {
    recommendedActions.push(
      "Monitor contract upgrades and verify who controls the proxy admin."
    );
  }
  if (scan.metadata.sourceVerified !== true) {
    recommendedActions.push(
      "Confirm the contract source is verified on the block explorer."
    );
  }
  recommendedActions.push(
    "Cross-check this target with independent sources before interacting."
  );

  const technicalNotes = [
    "Selector detection is a best-effort bytecode heuristic and may have false positives or false negatives.",
    "Proxy detection is best-effort (EIP-1967 slot / selectors).",
    scan.metadata.sourceVerified === "unknown"
      ? "Source verification status was not resolved (no explorer lookup in this phase)."
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    reportVersion: AI_REPORT_VERSION,
    provider: "guardfi-fallback",
    model: "deterministic",
    generatedAt: new Date().toISOString(),
    executiveSummary: `This ${scan.scanType.toLowerCase()} scan of ${scan.targetAddress} on chain ${scan.chainId} produced a deterministic risk score of ${scan.riskScore}/100 (${scan.riskLevel}). ${scan.riskIndicators.length} risk signal(s) were detected by best-effort analysis.`,
    riskExplanation: `${summaryForLevel(scan.riskLevel)} The score is derived from a fixed ruleset (v${scan.rulesetVersion}); the same contract always yields the same score.`,
    keyFindings,
    recommendedActions: recommendedActions.slice(0, 8),
    technicalNotes,
    limitations: [
      "Analysis is limited to on-chain bytecode and metadata available at scan time.",
      "No liquidity, holder, price, or exploit-history data is included.",
      "This is not a formal audit and does not guarantee the absence of vulnerabilities.",
    ],
    disclaimer: DISCLAIMER,
  };
}

export { DISCLAIMER };
