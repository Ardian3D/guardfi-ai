"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Menu, X, ShieldCheck } from "lucide-react";
import { LandingButton } from "@/components/landing/LandingButton";

const NAV_LINKS = [
  { label: "Problem", href: "/#problem" },
  { label: "Solution", href: "/#solution" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
  { label: "Tech Stack", href: "/#tech-stack" },
  { label: "Demo", href: "/#demo" },
  { label: "Docs", href: "/docs" },
];

function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/guardfi-logo.png"
        alt="GuardFi AI logo"
        width={32}
        height={32}
        priority
        className="h-8 w-8 object-contain"
      />
      <span className="font-display text-lg font-bold tracking-tight text-white">
        Guard<span className="text-brand-400">Fi</span>{" "}
        <span className="brand-gradient-text">AI</span>
      </span>
    </span>
  );
}

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="GuardFi AI home">
          <Wordmark />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors hover:text-white"
          >
            <ShieldCheck className="h-4 w-4" /> Verify Report
          </Link>
          <LandingButton href="/connect?redirect=/dashboard" className="px-5 py-2.5">
            Launch App
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </LandingButton>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <LandingButton href="/connect?redirect=/dashboard" className="px-4 py-2 text-xs">
            Launch App
          </LandingButton>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-slate-200 hover:bg-white/5"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="border-t border-border/60 bg-background/95 px-4 py-4 backdrop-blur-xl lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/verify"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <ShieldCheck className="h-4 w-4" /> Verify Report
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
