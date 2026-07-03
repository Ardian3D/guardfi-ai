import * as React from "react";
import { ScanLine, FileText, Anchor } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal, Stagger, StaggerItem, GlowCard } from "./motion";

const SOLUTIONS = [
  {
    icon: ScanLine,
    step: "Scan Contract",
    title: "Read the contract, not the hype",
    text: "GuardFi AI inspects bytecode and on-chain metadata, detecting privileged functions and risk signals.",
  },
  {
    icon: FileText,
    step: "Generate Risk Report",
    title: "Turn signals into a clear score",
    text: "A deterministic engine produces a 0–100 risk score with structured, machine- and human-readable indicators.",
  },
  {
    icon: Anchor,
    step: "Anchor Proof On-Chain",
    title: "Make the report verifiable",
    text: "A tamper-evident report commitment is anchored on HashKey Chain so anyone can verify it later.",
  },
];

export function SolutionFlow() {
  return (
    <section id="solution" className="scroll-mt-24 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            index="02"
            eyebrow="The Solution"
            title="GuardFi AI Turns Contract Risk Into"
            highlight="Verifiable Intelligence."
            subtitle="Automated analysis, transparent scoring, and on-chain proof — combined into one clean workflow."
          />
        </Reveal>

        <Stagger className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SOLUTIONS.map((s, i) => (
            <StaggerItem key={s.step}>
              <GlowCard className="relative h-full p-8">
                <span className="absolute right-6 top-6 font-display text-5xl font-bold text-white/5">
                  {i + 1}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
                  <s.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mt-5 text-xs font-medium uppercase tracking-wider text-brand-300">
                  {s.step}
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{s.text}</p>
              </GlowCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
