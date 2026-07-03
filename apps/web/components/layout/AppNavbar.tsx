"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { NetworkBadge } from "@/components/wallet/NetworkBadge";
import { WalletButton } from "@/components/wallet/WalletButton";

/**
 * App-section top bar. Mirrors the landing Navbar's shell (sticky, bordered,
 * blurred) but only carries the GuardFi logo, the active chain, and the
 * connect-wallet control — no marketing links.
 */
export function AppNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="GuardFi AI home"
          className="flex items-center gap-2.5"
        >
          <Image
            src="/guardfi-logo.png"
            alt="GuardFi AI logo"
            width={32}
            height={32}
            priority
            className="h-8 w-8 object-contain"
          />
          <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
            GuardFi AI
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <NetworkBadge />
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
