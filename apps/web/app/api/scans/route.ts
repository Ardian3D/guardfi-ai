import { NextResponse } from "next/server";
import { runScan, ScanError } from "@/lib/risk-engine/scanner";

// viem HTTP transport needs the Node runtime.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/scans
 * Body: { targetAddress: string, chainId: number, scanType: "TOKEN" | "CONTRACT", walletAddress?: string }
 * Returns a ScanResult, or a clear error { error, code }.
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

  const { targetAddress, chainId, scanType, walletAddress } =
    (body ?? {}) as Record<string, unknown>;

  try {
    const result = await runScan({
      targetAddress: typeof targetAddress === "string" ? targetAddress : "",
      chainId: typeof chainId === "number" ? chainId : Number(chainId),
      scanType: scanType === "CONTRACT" ? "CONTRACT" : "TOKEN",
      walletAddress:
        typeof walletAddress === "string" ? walletAddress : undefined,
    });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof ScanError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status }
      );
    }
    console.error("Unexpected scan error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while scanning.", code: "INTERNAL" },
      { status: 500 }
    );
  }
}
