"use client";

import * as React from "react";
import { ScanSearch, Gauge, Anchor, ShieldCheck, CheckCircle2 } from "lucide-react";
import { LightHeading } from "./LightHeading";
import { Reveal, Stagger, StaggerItem } from "./motion";

const COLS = [
  {
    icon: ScanSearch,
    title: "Inspect the contract",
    text: "Read bytecode and on-chain metadata to surface privileged functions and risk signals.",
  },
  {
    icon: Gauge,
    title: "Score the risk",
    text: "A deterministic engine turns findings into a clear 0–100 score with severity breakdowns.",
  },
  {
    icon: Anchor,
    title: "Prove it on-chain",
    text: "Anchor a tamper-evident report commitment so anyone can verify it later.",
  },
];

export function SolutionsLight() {
  return (
    <section id="solution" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <LightHeading
          label="Solutions"
          title="Turn contract risk into verifiable intelligence"
          subtitle="Everything you need to understand a DeFi contract before you interact with it."
        />

        <Stagger className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {COLS.map((c) => (
            <StaggerItem key={c.title}>
              <div className="text-center sm:text-left">
                <div className="clay-tile mx-auto flex h-11 w-11 items-center justify-center rounded-xl sm:mx-0">
                  <c.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-slate-900">
                  {c.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-500">{c.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Product mockup inside a blue panel */}
        <Reveal delay={0.1}>
          <div className="relative mt-14">
            <div className="rounded-[2rem] bg-gradient-to-br from-blue-600 to-blue-500 p-4 shadow-[0_40px_80px_-30px_rgba(37,99,235,0.6)] sm:p-8">
              <DashboardMock />
            </div>
            {/* floating check badge */}
            <div className="clay-tile absolute -right-3 top-10 hidden h-14 w-14 items-center justify-center rounded-2xl sm:flex">
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function DashboardMock() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl">
      {/* top bar */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600">
            <ShieldCheck className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-slate-900">Scan Result</span>
        </div>
        <span className="font-mono text-xs text-slate-400">0x8f3a…7bC9d2</span>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[1.4fr_1fr]">
        {/* left: indicators */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Risk Indicators
          </div>
          {[
            { label: "Owner Privileges", sev: "High", tone: "bg-rose-400", w: "72%", pill: "text-rose-500 bg-rose-50" },
            { label: "Mint Function", sev: "High", tone: "bg-rose-400", w: "64%", pill: "text-rose-500 bg-rose-50" },
            { label: "Proxy Pattern", sev: "Medium", tone: "bg-amber-400", w: "44%", pill: "text-amber-600 bg-amber-50" },
            { label: "Blacklist", sev: "Low", tone: "bg-emerald-400", w: "18%", pill: "text-emerald-600 bg-emerald-50" },
          ].map((r) => (
            <div key={r.label}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-700">{r.label}</span>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${r.pill}`}>
                  {r.sev}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100">
                <div className={`h-1.5 rounded-full ${r.tone}`} style={{ width: r.w }} />
              </div>
            </div>
          ))}
        </div>

        {/* right: score + proof */}
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 text-center">
            <div className="text-xs uppercase tracking-wide text-slate-400">
              Risk Score
            </div>
            <div className="mt-1 font-display text-4xl font-extrabold text-rose-500">
              72
            </div>
            <div className="text-xs font-semibold text-rose-500">High Risk</div>
          </div>
          <div className="rounded-xl border border-slate-100 p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">On-Chain Proof</span>
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Anchored
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Report Hash</span>
              <span className="font-mono text-slate-700">0x9b7e…4e</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
