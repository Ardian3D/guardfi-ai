"use client";

import * as React from "react";
import { ArrowUpRight, PlayCircle, ShieldCheck, Anchor } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Reveal, GlowCard } from "./motion";
import { LandingButton } from "./LandingButton";

const SAMPLE_TARGET_SHORT = "0x8f3a…7bC9d2";
const SAMPLE_REPORT_HASH = "0x9b7e2c6f3a8d…4e";

export function DemoPreview() {
  return (
    <section id="demo" className="scroll-mt-24 py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-600/20 via-surface to-surface p-8 shadow-glow-lg sm:p-12">
          {/* decorative glows */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-sky-500/15 blur-[120px]" />

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            {/* Copy + CTAs */}
            <Reveal>
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-200">
                  <ShieldCheck className="h-3.5 w-3.5" /> Read-only · No sign-up
                </div>
                <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Ready to Scan Your{" "}
                  <span className="brand-gradient-text">First Contract?</span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-slate-300 lg:mx-0">
                  Run a live risk scan on HashKey Chain, generate a report hash,
                  and anchor a verifiable proof on-chain in minutes.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start justify-center">
                  <LandingButton href="/connect?redirect=/scan" className="w-full sm:w-auto">
                    Launch Scanner
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </LandingButton>
                  <LandingButton
                    href="/connect?redirect=/scan/scan_9f8c7d2b1a3e4f6"
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    <PlayCircle className="h-4 w-4" /> View Demo Result
                  </LandingButton>
                </div>
              </div>
            </Reveal>

            {/* Mini preview card */}
            <Reveal delay={0.12}>
              <GlowCard className="p-6">
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-white">
                    Scan Result Preview
                  </span>
                  <Badge tone="high">High Risk</Badge>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <Row label="Target Contract">
                    <span className="font-mono text-slate-200">
                      {SAMPLE_TARGET_SHORT}
                    </span>
                  </Row>
                  <Row label="Risk Score">
                    <span className="font-display text-lg font-bold text-risk-high">
                      72 <span className="text-xs text-slate-500">/ 100</span>
                    </span>
                  </Row>
                  <Row label="Report Hash">
                    <span className="font-mono text-slate-200">
                      {SAMPLE_REPORT_HASH}
                    </span>
                  </Row>
                  <Row label="Status">
                    <span className="inline-flex items-center gap-1.5 text-brand-200">
                      <Anchor className="h-3.5 w-3.5" /> Ready to Anchor
                    </span>
                  </Row>
                </div>

                <p className="mt-4 border-t border-border pt-3 text-xs text-slate-500">
                  Sample target for demonstration only — not an endorsed asset.
                </p>
              </GlowCard>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-muted/40 px-3 py-2.5">
      <span className="text-slate-400">{label}</span>
      {children}
    </div>
  );
}
