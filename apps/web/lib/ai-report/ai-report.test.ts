import { describe, it, expect } from "vitest";
import type { ScanResult } from "../risk-engine/types";
import { buildFallbackReport } from "./fallback";
import { parseAiReport, sanitizeText } from "./parser";
import { buildMessages, minimizeScanResult } from "./prompt";

function sampleScan(): ScanResult {
  return {
    scanId: "scan_test123",
    targetAddress: "0x1111111111111111111111111111111111111111",
    chainId: 177,
    scanType: "TOKEN",
    status: "COMPLETED",
    metadata: {
      targetAddress: "0x1111111111111111111111111111111111111111",
      chainId: 177,
      isContract: true,
      bytecodeSize: 4200,
      tokenName: "Sample Token",
      tokenSymbol: "SMPL",
      decimals: 18,
      totalSupply: "1000",
      sourceVerified: "unknown",
      proxyDetected: true,
      detectedSelectors: ["owner()", "mint(address,uint256)"],
      scanTime: new Date().toISOString(),
    },
    riskScore: 72,
    riskLevel: "HIGH",
    riskIndicators: [
      { code: "OWNER_PRIVILEGE_DETECTED", severity: "HIGH", title: "Owner privileges", description: "d", evidence: "owner()", confidence: "MEDIUM" },
      { code: "MINT_FUNCTION_DETECTED", severity: "HIGH", title: "Mint function", description: "d", evidence: "mint()", confidence: "MEDIUM" },
      { code: "BYTECODE_AVAILABLE", severity: "LOW", title: "Bytecode", description: "d", evidence: "x", confidence: "HIGH" },
    ],
    aiSummaryPreview: "preview",
    rulesetVersion: "0.1.0",
    createdAt: new Date().toISOString(),
  };
}

describe("fallback generator", () => {
  it("produces all required fields", () => {
    const r = buildFallbackReport(sampleScan());
    expect(r.reportVersion).toBeTruthy();
    expect(r.provider).toBe("guardfi-fallback");
    expect(r.executiveSummary.length).toBeGreaterThan(0);
    expect(r.riskExplanation.length).toBeGreaterThan(0);
    expect(r.keyFindings.length).toBeGreaterThan(0);
    expect(r.recommendedActions.length).toBeGreaterThan(0);
    expect(r.technicalNotes.length).toBeGreaterThan(0);
    expect(r.limitations.length).toBeGreaterThan(0);
    expect(r.disclaimer.length).toBeGreaterThan(0);
  });

  it("sorts key findings by severity (highest first)", () => {
    const r = buildFallbackReport(sampleScan());
    expect(r.keyFindings[0].severity).toBe("HIGH");
  });
});

describe("parser", () => {
  it("parses valid JSON into a report", () => {
    const raw = JSON.stringify({
      executiveSummary: "ok",
      riskExplanation: "ok",
      keyFindings: [
        { title: "T", severity: "HIGH", explanation: "e", evidence: "ev", recommendation: "r" },
      ],
      recommendedActions: ["a"],
      technicalNotes: "notes",
      limitations: ["l"],
      disclaimer: "d",
    });
    const r = parseAiReport(raw, sampleScan(), { provider: "deepseek", model: "deepseek-v4-flash" });
    expect(r).not.toBeNull();
    expect(r!.provider).toBe("deepseek");
    expect(r!.keyFindings[0].severity).toBe("HIGH");
  });

  it("returns null for invalid JSON so the caller can fall back", () => {
    expect(parseAiReport("not json", sampleScan(), { provider: "deepseek", model: "m" })).toBeNull();
  });

  it("fills missing fields from the fallback", () => {
    const r = parseAiReport("{}", sampleScan(), { provider: "deepseek", model: "m" });
    expect(r).not.toBeNull();
    expect(r!.executiveSummary.length).toBeGreaterThan(0);
    expect(r!.keyFindings.length).toBeGreaterThan(0);
  });

  it("caps key findings at 8", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({
      title: `T${i}`, severity: "LOW", explanation: "e", evidence: "ev", recommendation: "r",
    }));
    const raw = JSON.stringify({ keyFindings: many });
    const r = parseAiReport(raw, sampleScan(), { provider: "deepseek", model: "m" });
    expect(r!.keyFindings.length).toBeLessThanOrEqual(8);
  });

  it("coerces invalid severity to MEDIUM", () => {
    const raw = JSON.stringify({
      keyFindings: [{ title: "T", severity: "SUPER_BAD", explanation: "e", evidence: "ev", recommendation: "r" }],
    });
    const r = parseAiReport(raw, sampleScan(), { provider: "deepseek", model: "m" });
    expect(r!.keyFindings[0].severity).toBe("MEDIUM");
  });
});

describe("sanitizeText (forbidden claims)", () => {
  it("removes guaranteed safe / certified audit / formal audit / financial advice", () => {
    expect(sanitizeText("This is guaranteed safe")).not.toMatch(/guaranteed safe/i);
    expect(sanitizeText("a certified audit")).not.toMatch(/certified audit/i);
    expect(sanitizeText("a formal audit here")).not.toMatch(/formal audit/i);
    expect(sanitizeText("this is financial advice")).not.toMatch(/financial advice/i);
  });

  it("sanitizes forbidden claims inside parsed reports", () => {
    const raw = JSON.stringify({ executiveSummary: "This token is guaranteed safe." });
    const r = parseAiReport(raw, sampleScan(), { provider: "deepseek", model: "m" });
    expect(r!.executiveSummary).not.toMatch(/guaranteed safe/i);
  });
});

describe("prompt builder", () => {
  it("minimizes the scan result without extra fields", () => {
    const min = minimizeScanResult(sampleScan()) as Record<string, unknown>;
    expect(min.scanId).toBeTruthy();
    // must NOT leak internal-only fields
    expect("aiSummaryPreview" in min).toBe(false);
    expect("status" in min).toBe(false);
    expect("createdAt" in min).toBe(false);
  });

  it("builds a system + user message pair", () => {
    const msgs = buildMessages(sampleScan());
    expect(msgs).toHaveLength(2);
    expect(msgs[0].role).toBe("system");
    expect(msgs[1].role).toBe("user");
    expect(msgs[0].content).toMatch(/not a formal audit/i);
  });
});
