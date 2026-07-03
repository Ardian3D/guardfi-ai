import type { ScanResult } from "../risk-engine/types";
import type { AiReportResponse } from "./types";
import { buildMessages } from "./prompt";
import { callDeepSeek, getModel, hasApiKey } from "./deepseek";
import { parseAiReport } from "./parser";
import { buildFallbackReport } from "./fallback";

/**
 * Server-side orchestrator. Adapter-based: tries DeepSeek when configured,
 * otherwise (or on ANY failure) returns a deterministic fallback report.
 * Never throws.
 */
export async function generateAiReport(
  scan: ScanResult
): Promise<AiReportResponse> {
  if (!hasApiKey()) {
    return { aiReport: buildFallbackReport(scan), source: "fallback" };
  }

  try {
    const raw = await callDeepSeek(buildMessages(scan));
    const parsed = parseAiReport(raw, scan, {
      provider: "deepseek",
      model: getModel(),
    });
    if (!parsed) {
      return { aiReport: buildFallbackReport(scan), source: "fallback" };
    }
    return { aiReport: parsed, source: "deepseek" };
  } catch {
    // Missing key, HTTP error, timeout, rate limit, bad JSON — all fall back.
    return { aiReport: buildFallbackReport(scan), source: "fallback" };
  }
}
