"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useWallet, isAppReady } from "@/lib/wallet";

/**
 * Protected route prefixes — require a connected wallet on HashKey Chain.
 * Public routes (/, /connect, /verify, /docs/*) are intentionally excluded.
 */
const PROTECTED_PREFIXES = ["/scan", "/dashboard", "/reports", "/target"];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * Gates protected routes using real wagmi state:
 * - not connected OR wrong network → redirect to /connect?redirect=<path>
 * - while the initial reconnect is still resolving → show a loader (never
 *   redirect prematurely, never flash protected content)
 */
export function RouteGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const wallet = useWallet();

  // Guard against SSR/first-paint: don't decide until mounted on the client.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const gated = isProtected(pathname);
  const ready = isAppReady(wallet);
  // "Undetermined" = not mounted yet, or wagmi still (re)connecting.
  const resolving = !mounted || wallet.connecting;

  React.useEffect(() => {
    if (gated && !resolving && !ready) {
      router.replace(`/connect?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [gated, resolving, ready, pathname, router]);

  if (gated && (resolving || !ready)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <p className="text-sm">
          {resolving ? "Checking wallet connection…" : "Redirecting to connect…"}
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
