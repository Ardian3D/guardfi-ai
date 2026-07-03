"use client";

import * as React from "react";
import { Wallet, Crosshair, Radar, Hash, Anchor, ShieldCheck } from "lucide-react";
import { LightHeading } from "./LightHeading";
import { Stagger, StaggerItem } from "./motion";

const STEPS = [
  { icon: Wallet, title: "Connect Wallet", text: "Connect on HashKey Chain to begin." },
  { icon: Crosshair, title: "Enter Target", text: "Paste any token or contract address." },
  { icon: Radar, title: "Analyze Risk", text: "Bytecode and metadata are inspected." },
  { icon: Hash, title: "Generate Hash", text: "A deterministic report hash is computed." },
  { icon: Anchor, title: "Anchor Proof", text: "Your wallet saves it on-chain." },
  { icon: ShieldCheck, title: "Verify Anytime", text: "Anyone can verify the report." },
];

export function HowItWorksLight() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white/50 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <LightHeading
          label="How It Works"
          title="From address to on-chain proof"
          subtitle="Six simple steps from a raw contract address to a verifiable report."
        />

        <div className="relative mt-12">
          <div className="pointer-events-none absolute inset-x-0 top-[34px] hidden h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent lg:block" />
          <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {STEPS.map((s, i) => (
              <StaggerItem key={s.title}>
                <div className="text-center">
                  <div className="clay-tile relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl">
                    <s.icon className="h-6 w-6 text-blue-600" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-sm font-bold text-slate-900">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{s.text}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
