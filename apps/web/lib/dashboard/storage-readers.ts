"use client";

import type { ScanResult } from "../risk-engine/types";
import type { ReportSubmission } from "../reports/types";
import type { PremiumUnlock } from "../hsp/types";

/** Storage keys used across the app (must match the writers). */
const SCAN_PREFIX = "guardfi:scan:"; // sessionStorage
const SUBMISSION_PREFIX = "guardfi:submission:"; // localStorage
const AIREPORT_PREFIX = "guardfi:aireport:"; // localStorage
const PREMIUM_PREFIX = "guardfi:premium:"; // localStorage

type Storage = { length: number; key(i: number): string | null; getItem(k: string): string | null };

/** Safely collect + parse all values under a prefix. Never throws. */
function readAll<T>(store: Storage | undefined, prefix: string): T[] {
  if (!store) return [];
  const out: T[] = [];
  try {
    for (let i = 0; i < store.length; i += 1) {
      const key = store.key(i);
      if (!key || !key.startsWith(prefix)) continue;
      const raw = store.getItem(key);
      if (!raw) continue;
      try {
        out.push(JSON.parse(raw) as T);
      } catch {
        /* skip corrupt entry */
      }
    }
  } catch {
    /* ignore storage access errors */
  }
  return out;
}

/** Collect the keys (not values) under a prefix. */
function readKeys(store: Storage | undefined, prefix: string): string[] {
  if (!store) return [];
  const out: string[] = [];
  try {
    for (let i = 0; i < store.length; i += 1) {
      const key = store.key(i);
      if (key && key.startsWith(prefix)) out.push(key);
    }
  } catch {
    /* ignore */
  }
  return out;
}

function sessionStore(): Storage | undefined {
  return typeof window === "undefined" ? undefined : window.sessionStorage;
}
function localStore(): Storage | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

export function getAllScanResults(): ScanResult[] {
  return readAll<ScanResult>(sessionStore(), SCAN_PREFIX).filter(
    (s) => s && typeof s.scanId === "string"
  );
}

export function getAllReportSubmissions(): ReportSubmission[] {
  return readAll<ReportSubmission>(localStore(), SUBMISSION_PREFIX).filter(
    (s) => s && typeof s.scanId === "string"
  );
}

/** AiReport bodies don't carry scanId, so derive it from the storage key. */
export function getAllAiReportScanIds(): string[] {
  return readKeys(localStore(), AIREPORT_PREFIX).map((k) =>
    k.slice(AIREPORT_PREFIX.length)
  );
}

export function getAllPremiumUnlocks(): PremiumUnlock[] {
  return readAll<PremiumUnlock>(localStore(), PREMIUM_PREFIX).filter(
    (u) => u && typeof u.scanId === "string" && typeof u.walletAddress === "string"
  );
}
