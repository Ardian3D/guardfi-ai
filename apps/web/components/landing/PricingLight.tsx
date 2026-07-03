"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { LightHeading } from "./LightHeading";
import { Reveal } from "./motion";

type Plan = {
  name: string;
  price: string;
  unit: string;
  blurb: string;
  cta: string;
  href: string;
  features: string[];
  featured?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Free Scan",
    price: "Free",
    unit: "",
    blurb: "For anyone checking a contract.",
    cta: "Start Scanning",
    href: "/connect?redirect=/scan",
    features: [
      "Deterministic risk scan",
      "0–100 risk score",
      "Risk indicators",
      "Public report verification",
    ],
  },
  {
    name: "Premium Report",
    price: "HSP",
    unit: "/report",
    blurb: "Full report, paid with HSP.",
    cta: "Unlock with HSP",
    href: "/connect?redirect=/scan",
    featured: true,
    features: [
      "Everything in Free Scan",
      "Full AI report summary",
      "Downloadable JSON",
      "On-chain proof link",
    ],
  },
  {
    name: "For Builders",
    price: "Soon",
    unit: "",
    blurb: "Embed risk checks in your dApp.",
    cta: "Read the Docs",
    href: "/docs",
    features: [
      "Programmatic scans",
      "Registry integration",
      "Verification widget",
      "Priority support",
    ],
  },
];

export function PricingLight() {
  return (
    <section id="pricing" className="scroll-mt-24 py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <LightHeading
          label="Pricing"
          title="Simple, honest access"
          subtitle="Scanning and verification are free. Premium reports settle with HSP. GuardFi AI has no token."
        />

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-center">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={
                  p.featured
                    ? "rounded-3xl bg-gradient-to-b from-blue-600 to-blue-500 p-7 text-white shadow-[0_30px_70px_-25px_rgba(37,99,235,0.6)] lg:-my-4 lg:py-10"
                    : "card-soft rounded-3xl p-7"
                }
              >
                {p.featured && (
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold">
                    <Zap className="h-3 w-3" /> Best value
                  </div>
                )}
                <h3
                  className={`font-display text-lg font-bold ${
                    p.featured ? "text-white" : "text-slate-900"
                  }`}
                >
                  {p.name}
                </h3>
                <p className={`mt-0.5 text-sm ${p.featured ? "text-blue-100" : "text-slate-500"}`}>
                  {p.blurb}
                </p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span
                    className={`font-display text-4xl font-extrabold ${
                      p.featured ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {p.price}
                  </span>
                  <span className={p.featured ? "text-blue-100" : "text-slate-400"}>
                    {p.unit}
                  </span>
                </div>

                <Link
                  href={p.href}
                  className={`mt-5 block rounded-full px-4 py-2.5 text-center text-sm font-semibold transition-all hover:-translate-y-0.5 ${
                    p.featured
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}
                >
                  {p.cta}
                </Link>

                <ul className="mt-6 space-y-2.5">
                  {p.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-center gap-2 text-sm ${
                        p.featured ? "text-blue-50" : "text-slate-600"
                      }`}
                    >
                      <Check
                        className={`h-4 w-4 shrink-0 ${
                          p.featured ? "text-white" : "text-blue-600"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
