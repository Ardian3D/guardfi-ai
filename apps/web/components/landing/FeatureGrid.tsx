import * as React from "react";
import {
  Gauge,
  Sparkles,
  Hash,
  Boxes,
  ShieldCheck,
  Crown,
  Link2,
  Ban,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal, Stagger, StaggerItem, GlowCard } from "./motion";

const FEATURES = [
  { icon: Gauge, title: "Deterministic Risk Engine", text: "Reproducible 0–100 scoring from inspectable rules." },
  { icon: Sparkles, title: "AI Report Summary", text: "Plain-language explanations of deterministic findings." },
  { icon: Hash, title: "Report Hashing", text: "Stable keccak256 commitment for every report." },
  { icon: Boxes, title: "On-Chain Registry", text: "Commitments stored in GuardFiReportRegistry." },
  { icon: ShieldCheck, title: "Public Verification", text: "Anyone can verify a report by its ID on-chain." },
  { icon: Crown, title: "HSP Premium Unlock Ready", text: "Architecture ready for token-gated premium reports." },
  { icon: Link2, title: "HashKey Chain Native", text: "Built for HashKey Chain mainnet from day one." },
  { icon: Ban, title: "No Project Token", text: "GuardFi AI is infrastructure — it has no token." },
];

export function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-24 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            index="04"
            eyebrow="Features"
            title="Everything You Need to"
            highlight="Trust On-Chain."
          />
        </Reveal>
        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <StaggerItem key={f.title}>
              <GlowCard className="h-full p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15">
                  <f.icon className="h-5 w-5 text-brand-300" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-white">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{f.text}</p>
              </GlowCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
