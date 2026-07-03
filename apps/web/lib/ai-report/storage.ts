"use client";

import type { AiReport } from "./types";

/** Browser storage for generated AI reports, keyed by scanId (no database). */
const KEY_PREFIX = "guardfi:aireport:";

export function saveAiReport(scanId: string, report: AiReport): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      `${KEY_PREFIX}${scanId}`,
      JSON.stringify(report)
    );
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export function getAiReport(scanId: string): AiReport | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${KEY_PREFIX}${scanId}`);
    return raw ? (JSON.parse(raw) as AiReport) : null;
  } catch {
    return null;
  }
}

export function clearAiReport(scanId: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(`${KEY_PREFIX}${scanId}`);
  } catch {
    /* ignore */
  }
}
