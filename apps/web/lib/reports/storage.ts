"use client";

import type { ReportSubmission } from "./types";

/**
 * Local submission records (MVP, no database). Keyed by scanId in
 * localStorage so submission state persists across sessions.
 */
const KEY_PREFIX = "guardfi:submission:";

export function saveSubmission(submission: ReportSubmission): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      `${KEY_PREFIX}${submission.scanId}`,
      JSON.stringify(submission)
    );
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

export function getSubmission(scanId: string): ReportSubmission | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(`${KEY_PREFIX}${scanId}`);
    return raw ? (JSON.parse(raw) as ReportSubmission) : null;
  } catch {
    return null;
  }
}

/** Find a stored submission by its on-chain reportId (used by /verify compare). */
export function findSubmissionByReportId(
  reportId: string
): ReportSubmission | null {
  if (typeof window === "undefined") return null;
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (!key || !key.startsWith(KEY_PREFIX)) continue;
      const raw = window.localStorage.getItem(key);
      if (!raw) continue;
      const sub = JSON.parse(raw) as ReportSubmission;
      if (sub.reportId === reportId) return sub;
    }
  } catch {
    /* ignore */
  }
  return null;
}
