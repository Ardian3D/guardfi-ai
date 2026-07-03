"use client";

import * as React from "react";
import {
  Boxes,
  FileCode2,
  Braces,
  Wallet,
  Rainbow,
  Atom,
  BrainCircuit,
  ShieldCheck,
  Link2,
  Gauge,
  type LucideIcon,
} from "lucide-react";
import { Marquee } from "./motion";

const ITEMS: { label: string; icon: LucideIcon }[] = [
  { label: "HashKey Chain", icon: Boxes },
  { label: "Solidity", icon: FileCode2 },
  { label: "Viem", icon: Braces },
  { label: "Wagmi", icon: Wallet },
  { label: "RainbowKit", icon: Rainbow },
  { label: "Next.js", icon: Atom },
  { label: "AI Report Engine", icon: BrainCircuit },
  { label: "GuardFiReportRegistry", icon: ShieldCheck },
  { label: "On-Chain Proof", icon: Link2 },
  { label: "Risk Engine", icon: Gauge },
];

export function TechTicker() {
  return (
    <section
      id="tech-stack"
      className="relative scroll-mt-24 border-y border-border/60 bg-surface/30 py-6 backdrop-blur-sm"
    >
      <p className="mb-4 text-center text-xs uppercase tracking-[0.25em] text-slate-500">
        Powered by a modern, verifiable Web3 stack
      </p>
      <div className="relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <Marquee speed={34}>
          {ITEMS.map((it) => (
            <div
              key={it.label}
              className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-slate-300"
            >
              <it.icon className="h-4 w-4 text-brand-300" />
              <span className="whitespace-nowrap text-sm font-medium">
                {it.label}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
