import type { ScanResult } from "../risk-engine/types";
import type {
  AiReportResponse,
  AiReportFallbackReason,
  AiReportGenerationDebug,
} from "./types";
import { buildMessages } from "./prompt";
import {
  callDeepSeek,
  getModel,
  hasApiKey,
  aiDebugLog,
  DeepSeekError,
} from "./deepseek";
import { parseAiReport } from "./parser";
import { buildFallbackReport } from "./fallback";

/** Map a DeepSeekError code to a specific, secret-free fallback reason. */
function reasonFromError(error: unknown): AiReportFallbackReason {
  if (error instanceof DeepSeekError) {
    switch (error.code) {
      case "MISSING_KEY":
        return "missing_api_key";
      case "TIMEOUT":
        return "deepseek_timeout";
      case "NO_CONTENT":
        return "empty_content";
      case "HTTP_ERROR":
      case "RATE_LIMITED":
        return "deepseek_http_error";
      default:
        return "unknown_error";
    }
  }
  return "unknown_error";
}

function fallback(
  scan: ScanResult,
  fallbackReason: AiReportFallbackReason,
  deepseekStatus?: number
): AiReportResponse {
  const debug: AiReportGenerationDebug = {
    source: "fallback",
    fallbackReason,
    model: getModel(),
    ...(deepseekStatus !== undefined ? { deepseekStatus } : {}),
  };
  aiDebugLog("generation.result", debug as unknown as Record<string, unknown>);
  return { aiReport: buildFallbackReport(scan), source: "fallback", debug };
}

/**
 * Server-side orchestrator. Adapter-based: tries DeepSeek when configured,
 * otherwise (or on ANY failure) returns a deterministic fallback report.
 * Never throws. Always returns safe, secret-free `debug` diagnostics.
 */
export async function generateAiReport(
  scan: ScanResult
): Promise<AiReportResponse> {
  aiDebugLog("generation.start", {
    hasDeepSeekApiKey: hasApiKey(),
    model: getModel(),
  });

  if (!hasApiKey()) {
    return fallback(scan, "missing_api_key");
  }

  try {
    const { content, status, finishReason } = await callDeepSeek(
      buildMessages(scan)
    );
    const parsed = parseAiReport(content, scan, {
      provider: "deepseek",
      model: getModel(),
    });

    aiDebugLog("parser.result", {
      jsonParsed: parsed !== null,
      finishReason: finishReason ?? null,
    });

    if (!parsed) {
      // parseAiReport only returns null when content is not parseable JSON.
      return fallback(scan, "invalid_json", status);
    }

    const debug: AiReportGenerationDebug = {
      source: "deepseek",
      deepseekStatus: status,
      model: getModel(),
    };
    aiDebugLog("generation.result", debug as unknown as Record<string, unknown>);
    return { aiReport: parsed, source: "deepseek", debug };
  } catch (error) {
    const reason = reasonFromError(error);
    const status = error instanceof DeepSeekError ? error.status : undefined;
    return fallback(scan, reason, status);
  }
}
