"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DOCS_NAV } from "./nav";

/** Route-based docs sidebar with active-link highlighting. */
export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit">
      <div className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
        Documentation
      </div>
      <nav className="space-y-1">
        {DOCS_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-blue-50 font-semibold text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  active ? "text-blue-600" : "text-slate-400"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="card-soft mt-6 rounded-2xl p-4">
        <div className="text-sm font-semibold text-slate-900">Need help?</div>
        <p className="mt-1 text-xs text-slate-500">
          Questions or feedback? Reach out to our team.
        </p>
        <button className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-500">
          Contact Support →
        </button>
      </div>
    </aside>
  );
}
