import * as React from "react";
import {
  KeyRound,
  Coins,
  Ban,
  Layers,
  FileQuestion,
  SearchX,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal, Stagger, StaggerItem, GlowCard } from "./motion";

const PROBLEMS = [
  {
    icon: KeyRound,
    title: "Hidden admin privileges",
    text: "Owners can quietly change critical parameters, move funds, or seize control after launch.",
  },
  {
    icon: Coins,
    title: "Mint & supply manipulation",
    text: "Unlimited minting can dilute holders and crash value in a single transaction.",
  },
  {
    icon: Ban,
    title: "Blacklist & pause controls",
    text: "Privileged roles can freeze transfers or block specific wallets without warning.",
  },
  {
    icon: Layers,
    title: "Upgradeable proxy risk",
    text: "Proxy patterns let contract logic be swapped after you've already trusted it.",
  },
  {
    icon: FileQuestion,
    title: "Unverified source code",
    text: "When source is unknown or unverified, you're trusting bytecode you can't read.",
  },
  {
    icon: SearchX,
    title: "Reports are hard to verify",
    text: "Users rarely have a way to independently confirm that a risk report is authentic.",
  },
];

export function ProblemCards() {
  return (
    <section id="problem" className="scroll-mt-24 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            index="01"
            eyebrow="The Problem"
            title="DeFi Risk Is Hard to See"
            highlight="Before It Is Too Late."
            subtitle="Interacting with an unknown contract means trusting code you cannot see. The most damaging risks hide in plain sight."
          />
        </Reveal>
        <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEMS.map((p) => (
            <StaggerItem key={p.title}>
              <GlowCard className="h-full p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-400/20 bg-rose-500/[0.08]">
                  <p.icon className="h-5 w-5 text-rose-300" />
                </div>
                <h3 className="mt-4 font-display font-semibold text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-slate-400">{p.text}</p>
              </GlowCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
