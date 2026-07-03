import type { ScanResult } from "../risk-engine/types";

export interface ChatMessage {
  role: "system" | "user";
  content: string;
}

/** The exact JSON shape we ask the model to return. */
export const OUTPUT_SCHEMA = {
  executiveSummary: "string",
  riskExplanation: "string",
  keyFindings: [
    {
      title: "string",
      severity: "LOW | MEDIUM | HIGH | CRITICAL",
      explanation: "string",
      evidence: "string",
      recommendation: "string",
    },
  ],
  recommendedActions: ["string"],
  technicalNotes: "string",
  limitations: ["string"],
  disclaimer: "string",
} as const;

const SYSTEM_PROMPT = `You are GuardFi AI, an AI-powered DeFi risk report assistant.
You explain deterministic smart contract risk signals for the user.

Hard rules:
- Use ONLY the provided scan result. Do not invent vulnerabilities, token data, audit status, liquidity, holders, exploit history, prices, or any data not present.
- Do NOT provide financial advice.
- This is automated risk intelligence, NOT a formal audit and NOT a guarantee of safety.
- Selector detection is best-effort and may have false positives and false negatives. State this.
- Never claim a contract is "guaranteed safe", "certified", or "audited".
- Output VALID JSON only. No markdown. No code fences. No commentary outside the JSON object.`;

/** Minimize the scan result to only what the model needs (no extra fields). */
export function minimizeScanResult(scan: ScanResult) {
  return {
    scanId: scan.scanId,
    targetAddress: scan.targetAddress,
    chainId: scan.chainId,
    scanType: scan.scanType,
    riskScore: scan.riskScore,
    riskLevel: scan.riskLevel,
    rulesetVersion: scan.rulesetVersion,
    metadata: {
      isContract: scan.metadata.isContract,
      bytecodeSize: scan.metadata.bytecodeSize,
      tokenName: scan.metadata.tokenName ?? null,
      tokenSymbol: scan.metadata.tokenSymbol ?? null,
      decimals: scan.metadata.decimals ?? null,
      totalSupply: scan.metadata.totalSupply ?? null,
      sourceVerified: scan.metadata.sourceVerified,
      proxyDetected: scan.metadata.proxyDetected,
      detectedSelectors: scan.metadata.detectedSelectors,
      demoMode: scan.metadata.demoMode ?? false,
    },
    riskIndicators: scan.riskIndicators.map((i) => ({
      code: i.code,
      severity: i.severity,
      title: i.title,
      description: i.description,
      evidence: i.evidence,
      confidence: i.confidence,
    })),
  };
}

export function buildMessages(scan: ScanResult): ChatMessage[] {
  const user = {
    task: "Write a structured risk report that explains the scan result below. Base every statement strictly on this data.",
    outputSchema: OUTPUT_SCHEMA,
    severityAllowed: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
    scanResult: minimizeScanResult(scan),
  };
  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: JSON.stringify(user) },
  ];
}
