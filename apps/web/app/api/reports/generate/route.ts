import { NextResponse } from "next/server";
import { generateAiReport } from "@/lib/ai-report/generator";
import type { ScanResult } from "@/lib/risk-engine/types";

// DeepSeek is called server-side only; the API key never reaches the client.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidScanResult(v: unknown): v is ScanResult {
  if (!v || typeof v !== "object") return false;
  const s = v as Record<string, unknown>;
  return (
    typeof s.scanId === "string" &&
    typeof s.targetAddress === "string" &&
    typeof s.riskScore === "number" &&
    typeof s.riskLevel === "string" &&
    Array.isArray(s.riskIndicators) &&
    !!s.metadata &&
    typeof s.metadata === "object"
  );
}

/**
 * POST /api/reports/generate
 * Body: { scanResult: ScanResult }
 * Returns: { aiReport, source: "deepseek" | "fallback" }
 * Never crashes — always returns at least a fallback report.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON.", code: "INVALID_BODY" },
      { status: 400 }
    );
  }

  const scanResult = (body as { scanResult?: unknown } | null)?.scanResult;
  if (!isValidScanResult(scanResult)) {
    return NextResponse.json(
      { error: "A valid scanResult is required.", code: "INVALID_SCAN" },
      { status: 400 }
    );
  }

  try {
    const result = await generateAiReport(scanResult);
    // Never expose diagnostics in production; keep them for local debugging.
    if (process.env.NODE_ENV === "production") {
      delete result.debug;
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    // generateAiReport shouldn't throw, but guard anyway (do not leak details).
    console.error("AI report generation failed unexpectedly.");
    return NextResponse.json(
      { error: "Failed to generate the report.", code: "INTERNAL" },
      { status: 500 }
    );
  }
}
