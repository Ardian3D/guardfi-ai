"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * AppBackdrop — light theme across the whole product.
 * - Landing ("/"): off-white with a subtle dotted texture.
 * - Everything else (docs, app, connect): clean light gray.
 */
export function AppBackdrop({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  return (
    <div
      className={`relative min-h-screen overflow-hidden text-slate-900 ${
        isLanding ? "dotted-bg" : "bg-slate-50"
      }`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
