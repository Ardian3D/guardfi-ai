"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { AppNavbar } from "./AppNavbar";
import { LandingNavbar } from "./LandingNavbar";

/** Route prefixes that use the wallet-aware app top bar. */
const APP_PREFIXES = ["/scan", "/dashboard", "/verify", "/reports", "/target"];

/**
 * Top chrome (light theme everywhere):
 * - App routes (scan, dashboard, verify, reports, target) → AppNavbar (wallet).
 * - Everything else (landing, docs, connect) → LandingNavbar.
 */
export function SiteChrome() {
  const pathname = usePathname();

  const isAppRoute = APP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  return isAppRoute ? <AppNavbar /> : <LandingNavbar />;
}
