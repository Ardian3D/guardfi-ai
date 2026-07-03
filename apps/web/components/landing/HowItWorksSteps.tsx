import * as React from "react";
import {
  Wallet,
  Crosshair,
  Radar,
  Hash,
  Anchor,
  ShieldCheck,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal, Stagger, StaggerItem, GlowCard } from "./motion";

const STEPS = [
  { icon: Wallet, title: "Connect Wallet", text: "Connect on HashKey Chain to begin." },
  { icon: Crosshair, title: "Enter Target Contract", text: "Paste any token or contract address." },
  { icon: Radar, title: "Analyze Risk Signals", text: "The engine inspects bytecode and metadata." },
  { icon: Hash, title: "Generate Report Hash", text: "A deterministic report hash is computed." },
  { icon: Anchor, title: "Save Proof On-Chain", text: "Your wallet anchors the commitment." },
  { icon: ShieldCheck, title: "Verify Anytime", text: "Anyone can verify the report later." },
];

export function HowItWorksSteps() {
  return (
    <section id="how-it-works" className="scroll-mt-24 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            index="03"
            eyebrow="How It Works"
            title="From Address to"
            highlight="On-Chain Proof."
            subtitle="Six smooth steps from a raw contract address to a verifiable, tamper-evident report."
          />
        </Reveal>

        <div className="relative mt-14">
          {/* glowing connector line */}
          <div className="pointer-events-none absolute left-0 right-0 top-[38px] hidden h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent lg:block" />
          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
            {STEPS.map((s, i) => (
              <StaggerItem key={s.title}>
                <GlowCard className="relative h-full p-5 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-surface-muted/70 shadow-card">
                    <s.icon className="h-5 w-5 text-brand-300" />
                  </div>
                  <div className="mt-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Step {i + 1}
                  </div>
                  <h3 className="mt-1 font-display text-sm font-semibold text-white">
                    {s.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-400">{s.text}</p>
                </GlowCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
