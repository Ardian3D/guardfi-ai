"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Twitter,
  Github,
  MessageCircle,
  ScanLine,
  ShieldCheck,
  Hash,
} from "lucide-react";

export function Footer() {
  return <LandingFooter />;
}

/* ---------------- Light landing footer (design4-style) ---------------- */

const FOOTER_COLS = [
  {
    heading: "Product",
    links: [
      { label: "Scanner", href: "/connect?redirect=/scan" },
      { label: "Verify Report", href: "/verify" },
      { label: "Dashboard", href: "/connect?redirect=/dashboard" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Smart Contract", href: "/docs/contract" },
      { label: "On-Chain Proof", href: "/docs/on-chain" },
    ],
  },
];

const FLOATING = [
  { icon: ShieldCheck, cls: "right-[95%] top-[7%] gf-float-a", color: "text-blue-600" },
  { icon: Hash, cls: "left-[90%] top-[48%] gf-float-c", color: "text-slate-700" },
  { icon: ScanLine, cls: "left-[20%] bottom-[2%] gf-float-b", color: "text-emerald-500" },
];

function LandingFooter() {
  return (
    <footer className="relative mt-10 overflow-hidden">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="dotted-bg relative overflow-hidden rounded-[2rem] border border-slate-300 bg-white/60 p-8 sm:p-12">
          {/* floating icon tiles */}
          <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
            {FLOATING.map((f, i) => (
              <div
                key={i}
                className={`clay-tile absolute flex h-11 w-11 items-center justify-center rounded-2xl ${f.cls}`}
              >
                <f.icon className={`h-5 w-5 ${f.color}`} />
              </div>
            ))}
          </div>

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <Image
                  src="/guardfi-logo.png"
                  alt="GuardFi AI logo"
                  width={30}
                  height={30}
                  className="h-7 w-7 object-contain"
                />
                <span className="font-display text-lg font-extrabold text-slate-900">
                  GuardFi AI
                </span>
              </div>
              <h2 className="mt-5 max-w-md font-display text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                Scan smarter.{" "}
                <span className="text-slate-400">Trust on-chain.</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {FOOTER_COLS.map((col) => (
                <div key={col.heading}>
                  <div className="text-sm font-semibold text-slate-900">
                    {col.heading}
                  </div>
                  <ul className="mt-3 space-y-2.5">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="text-sm text-slate-500 transition-colors hover:text-blue-600"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
            <p>© 2026 GuardFi AI. Built on HashKey Chain.</p>
            <p className="max-w-md sm:text-right">
              GuardFi AI provides automated risk intelligence. It is not a formal
              audit or financial advice.
            </p>
          </div>
        </div>
      </div>
      <div className="h-10" />
    </footer>
  );
}

/* ---------------- Dark footer (app + docs) ---------------- */

function DarkFooter() {
  return (
    <footer className="relative z-10 border-t border-border/60 bg-background/60">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <Link href="/" aria-label="GuardFi AI home" className="flex items-center gap-2.5">
          <Image
            src="/guardfi-logo.png"
            alt="GuardFi AI logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="text-lg font-bold tracking-tight text-white">
            Guard<span className="text-brand-400">Fi</span>{" "}
            <span className="brand-gradient-text">AI</span>
          </span>
        </Link>
        <p className="text-sm text-slate-500">
          © 2026 GuardFi AI. Built on HashKey Chain.
        </p>
        <div className="flex items-center gap-4">
          <Link href="#" aria-label="Twitter" className="text-slate-400 transition-colors hover:text-white">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="#" aria-label="Discord" className="text-slate-400 transition-colors hover:text-white">
            <MessageCircle className="h-5 w-5" />
          </Link>
          <Link href="#" aria-label="GitHub" className="text-slate-400 transition-colors hover:text-white">
            <Github className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
