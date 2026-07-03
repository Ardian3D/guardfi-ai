"use client";

import * as React from "react";
import { ArrowUpRight, ShieldCheck, Boxes, Link2, BrainCircuit, Ban } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Aurora, Parallax } from "./motion";
import { LandingButton } from "./LandingButton";
import { RiskOrbit } from "./RiskOrbit";

const TRUST = [
  { icon: Boxes, label: "Built on HashKey Chain" },
  { icon: Link2, label: "On-Chain Proof" },
  { icon: BrainCircuit, label: "AI Risk Intelligence" },
  { icon: Ban, label: "No Token Required" },
];

export function NewHero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-20 lg:pt-24">
      <Aurora />
      {/* conic beam */}
      <div className="pointer-events-none absolute left-1/2 top-[-12%] h-[520px] w-[900px] -translate-x-1/2 opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]">
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0deg,rgba(123,133,255,0.22)_120deg,transparent_240deg)]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8 lg:px-8">
        {/* Left */}
        <div className="text-center lg:text-left">
          <motion.div
            {...rise(0)}
            className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200"
          >
            <span className="pulse-dot relative flex h-1.5 w-1.5 rounded-full bg-brand-300 text-brand-400" />
            AI-Powered DeFi Risk Guardian
          </motion.div>

          <motion.h1
            {...rise(0.08)}
            className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl xl:text-6xl"
          >
            Scan DeFi Contracts{" "}
            <span className="brand-gradient-text">Before You Trust Them.</span>
            <span className="mt-2 block text-slate-200">
              Verify Risk Reports{" "}
              <span className="animated-gradient-text">On-Chain.</span>
            </span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mx-auto mt-5 max-w-xl text-base text-slate-400 lg:mx-0 sm:text-lg"
          >
            GuardFi AI analyzes smart contracts, detects risk signals, generates
            structured reports, and anchors report proofs on HashKey Chain.
          </motion.p>

          <motion.div
            {...rise(0.24)}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start lg:justify-start justify-center"
          >
            <LandingButton href="/connect?redirect=/scan" className="w-full sm:w-auto">
              Start Scanning
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </LandingButton>
            <LandingButton href="/verify" variant="secondary" className="w-full sm:w-auto">
              <ShieldCheck className="h-4 w-4" /> Verify Report
            </LandingButton>
          </motion.div>

          {/* trust badges */}
          <motion.ul
            {...rise(0.32)}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start"
          >
            {TRUST.map((t) => (
              <li key={t.label} className="flex items-center gap-2 text-sm text-slate-400">
                <t.icon className="h-4 w-4 text-brand-300" />
                {t.label}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right: orbit */}
        <div className="relative">
          <Parallax speed={reduce ? 0 : 46}>
            <RiskOrbit />
          </Parallax>
        </div>
      </div>
    </section>
  );
}
