"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  ScanLine,
  Pin,
  CheckCircle2,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function HeroLight() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-14 sm:px-6 sm:pt-16 lg:px-8">
        {/* ---- Floating decorative cards (desktop only) ---- */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
          {/* sticky note top-left */}
          <motion.div
            {...rise(0.15)}
            className="absolute left-2 top-10 w-56 -rotate-6"
          >
            <div className="relative rounded-2xl bg-amber-100 p-4 shadow-[0_16px_40px_-16px_rgba(15,23,42,0.35)]">
              <Pin className="absolute -top-2 right-4 h-4 w-4 text-rose-400" />
              <p className="font-display text-sm font-medium leading-snug text-amber-900">
                Always verify a contract before you trust it with funds.
              </p>
            </div>
          </motion.div>

          {/* checkbox clay tile */}
          <motion.div {...rise(0.28)} className="gf-float-b absolute left-24 top-44">
            <div className="clay-tile flex h-14 w-14 items-center justify-center rounded-2xl">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
          </motion.div>

          {/* latest report card top-right */}
          <motion.div {...rise(0.22)} className="gf-float-a absolute right-2 top-12 w-64">
            <div className="card-soft rounded-2xl p-4">
              <div className="text-xs font-semibold text-slate-900">Latest Report</div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-500">Risk Score</span>
                <span className="rounded-full bg-rose-50 px-2 py-0.5 font-semibold text-rose-500">
                  72 · High
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">Report Hash</span>
                <span className="font-mono text-slate-700">0x9b7e…4e</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">Status</span>
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Anchored
                </span>
              </div>
            </div>
          </motion.div>

          {/* scan clay tile top-right */}
          <motion.div {...rise(0.34)} className="gf-float-c absolute right-24 top-52">
            <div className="clay-tile flex h-14 w-14 items-center justify-center rounded-2xl">
              <ScanLine className="h-6 w-6 text-slate-700" />
            </div>
          </motion.div>

          {/* risk scan card bottom-left */}
          <motion.div {...rise(0.3)} className="gf-float-b absolute bottom-4 left-2 w-72">
            <div className="card-soft rounded-2xl p-4">
              <div className="text-xs font-semibold text-slate-900">Risk Scan</div>
              {[
                { label: "Owner Privileges", w: "62%", tone: "bg-rose-400" },
                { label: "Mint Function", w: "22%", tone: "bg-amber-400" },
                { label: "Blacklist", w: "14%", tone: "bg-emerald-400" },
              ].map((r) => (
                <div key={r.label} className="mt-3 first:mt-3">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{r.label}</span>
                    <span>{r.w}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                    <div className={`h-1.5 rounded-full ${r.tone}`} style={{ width: r.w }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* powered-by card bottom-right */}
          <motion.div {...rise(0.36)} className="gf-float-a absolute bottom-6 right-2 w-60">
            <div className="card-soft rounded-2xl p-4">
              <div className="text-xs font-semibold text-slate-900">
                Powered by HashKey
              </div>
              <div className="mt-3 flex items-center gap-2">
                {["/hashkey-logo1.png", "/solidity.jpg", "/nextjs.jpg"].map(
                  (src, i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 bg-slate-50"
                    >
                      <Image
                        src={src}
                        alt=""
                        width={24}
                        height={24}
                        className="h-5 w-5 object-contain"
                      />
                    </div>
                  )
                )}
                <span className="ml-1 text-xs text-slate-400">+ more</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ---- Center content ---- */}
        <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
          <motion.div {...rise(0)} className="clay-tile flex h-16 w-16 items-center justify-center rounded-2xl">
            <Image
              src="/guardfi-logo.png"
              alt="GuardFi AI logo"
              width={40}
              height={40}
              priority
              className="h-10 w-10 object-contain"
            />
          </motion.div>

          <motion.h1
            {...rise(0.08)}
            className="mt-8 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl"
          >
            Scan DeFi contracts
            <span className="block text-slate-400">before you trust them</span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-5 max-w-xl text-base text-slate-500 sm:text-lg"
          >
            GuardFi AI analyzes smart contracts, detects risk signals, generates
            structured reports, and anchors verifiable proofs on HashKey Chain.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/connect?redirect=/scan"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-8px_rgba(37,99,235,0.6)] transition-all hover:-translate-y-0.5 hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2"
            >
              Start Scanning
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/connect?redirect=/scan/scan_9f8c7d2b1a3e4f6"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300"
            >
              View Demo
            </Link>
          </motion.div>

          <motion.div
            {...rise(0.32)}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500"
          >
            {["Built on HashKey Chain", "On-Chain Proof", "No Token Required"].map(
              (t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" /> {t}
                </span>
              )
            )}
          </motion.div>
        </div>

        {/* mobile preview card */}
        <motion.div {...rise(0.2)} className="mx-auto mt-12 max-w-sm lg:hidden">
          <div className="card-soft rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">Risk Scan</span>
              <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-500">
                72 · High
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {[
                { label: "Owner Privileges", w: "62%", tone: "bg-rose-400" },
                { label: "Mint Function", w: "22%", tone: "bg-amber-400" },
              ].map((r) => (
                <div key={r.label}>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{r.label}</span>
                    <span>{r.w}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                    <div className={`h-1.5 rounded-full ${r.tone}`} style={{ width: r.w }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
