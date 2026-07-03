"use client";

import type { ScanResult } from "./risk-engine/types";

/**
 * Client-side scan-result storage (MVP). Full results are kept in
 * sessionStorage keyed by scanId — no database in this phase.
 */
const KEY_PREFIX = "guardfi:scan:";

export function saveScanResult(result: ScanResult): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      `${KEY_PREFIX}${result.scanId}`,
      JSON.stringify(result)
    );
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export function getScanResult(scanId: string): ScanResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(`${KEY_PREFIX}${scanId}`);
    return raw ? (JSON.parse(raw) as ScanResult) : null;
  } catch {
    return null;
  }
}
