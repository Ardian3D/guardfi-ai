"use client";

import * as React from "react";
import { Gauge, Sparkles, Hash, ShieldCheck, Boxes, Crown } from "lucide-react";
import { LightHeading } from "./LightHeading";
import { Stagger, StaggerItem } from "./motion";

export function FeaturesLight() {
  return (
    <section id="features" className="scroll-mt-24 bg-white/50 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <LightHeading
          label="Features"
          title="Everything you need to trust on-chain"
          subtitle="From deterministic analysis to public, verifiable proof."
        />

        <Stagger className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Card 1 — Risk engine */}
          <StaggerItem>
            <div className="card-soft h-full rounded-3xl p-6 sm:p-8">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                {[
                  { l: "Owner Privileges", w: "72%", t: "bg-rose-400" },
                  { l: "Mint Function", w: "58%", t: "bg-rose-400" },
                  { l: "Proxy Pattern", w: "40%", t: "bg-amber-400" },
                ].map((r) => (
                  <div key={r.l} className="mb-3 last:mb-0">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{r.l}</span>
                      <span>{r.w}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-200/70">
                      <div className={`h-1.5 rounded-full ${r.t}`} style={{ width: r.w }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-2">
                <Gauge className="h-5 w-5 text-blue-600" />
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Deterministic Risk Engine
                </h3>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Reproducible 0–100 scoring from inspectable rules — the same
                contract always scores the same.
              </p>
            </div>
          </StaggerItem>

          {/* Card 2 — AI summary */}
          <StaggerItem>
            <div className="card-soft h-full rounded-3xl p-6 sm:p-8">
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
                  <Sparkles className="h-4 w-4" /> AI Summary
                </div>
                <p className="mt-3 space-y-1 text-sm leading-relaxed text-slate-600">
                  This contract exposes owner-controlled minting and an
                  upgradeable proxy. Treat with caution and verify the report
                  hash on-chain before interacting.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <h3 className="font-display text-lg font-bold text-slate-900">
                  AI Report Summary
                </h3>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Plain-language explanations of deterministic findings, so anyone
                can understand the risk.
              </p>
            </div>
          </StaggerItem>
        </Stagger>

        {/* Bottom row: wide + small */}
        <Stagger className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <StaggerItem className="lg:col-span-2">
            <div className="card-soft flex h-full flex-col justify-between rounded-3xl p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { i: Hash, t: "Report Hash" },
                  { i: Boxes, t: "Registry" },
                  { i: ShieldCheck, t: "Verified" },
                ].map((x) => (
                  <div key={x.t} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2">
                    <x.i className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-slate-700">{x.t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <h3 className="font-display text-lg font-bold text-slate-900">
                  Report Hashing & On-Chain Proof
                </h3>
                <p className="mt-2 max-w-lg text-sm text-slate-500">
                  Each report is hashed with keccak256 and its commitment is
                  anchored in GuardFiReportRegistry on HashKey Chain — signed by
                  your own wallet.
                </p>
              </div>
            </div>
          </StaggerItem>

          <StaggerItem>
            <div className="card-soft flex h-full flex-col rounded-3xl p-6 sm:p-8">
              <div className="clay-tile flex h-12 w-12 items-center justify-center rounded-2xl">
                <ShieldCheck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-slate-900">
                Public Verification
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Anyone can verify a report by its ID — no wallet required.
              </p>
              <div className="mt-auto pt-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                  <Crown className="h-3 w-3" /> HSP Premium Ready
                </span>
              </div>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
