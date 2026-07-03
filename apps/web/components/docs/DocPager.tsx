"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DOCS_NAV } from "./nav";

/** Previous / next navigation, driven by the shared DOCS_NAV order. */
export function DocPager() {
  const pathname = usePathname();
  const index = DOCS_NAV.findIndex((item) => item.href === pathname);
  if (index === -1) return null;

  const prev = index > 0 ? DOCS_NAV[index - 1] : null;
  const next = index < DOCS_NAV.length - 1 ? DOCS_NAV[index + 1] : null;

  return (
    <nav className="mt-14 grid grid-cols-1 gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-colors hover:border-blue-300 hover:bg-slate-50"
        >
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <ArrowLeft className="h-3.5 w-3.5" /> Previous
          </span>
          <span className="mt-1 text-sm font-semibold text-slate-700 group-hover:text-slate-900">
            {prev.label}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next && (
        <Link
          href={next.href}
          className="group flex flex-col items-end rounded-xl border border-slate-200 bg-white p-4 text-right shadow-sm transition-colors hover:border-blue-300 hover:bg-slate-50 sm:col-start-2"
        >
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            Next <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="mt-1 text-sm font-semibold text-slate-700 group-hover:text-slate-900">
            {next.label}
          </span>
        </Link>
      )}
    </nav>
  );
}
