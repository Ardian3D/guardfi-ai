"use client";

import * as React from "react";
import {
  UserCog,
  Coins,
  UserX,
  Layers,
  Hash,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CountUp } from "./motion";

type Node = {
  label: string;
  icon: LucideIcon;
  angle: number; // degrees, 0 = right, -90 = top
  color: string; // full tailwind text-color class (literal, so JIT keeps it)
};

const NODES: Node[] = [
  { label: "Owner Privileges", icon: UserCog, angle: -90, color: "text-risk-high" },
  { label: "Mint Risk", icon: Coins, angle: -30, color: "text-risk-high" },
  { label: "Proxy Pattern", icon: Layers, angle: 30, color: "text-risk-medium" },
  { label: "On-Chain Proof", icon: ShieldCheck, angle: 90, color: "text-brand-300" },
  { label: "Report Hash", icon: Hash, angle: 150, color: "text-brand-300" },
  { label: "Blacklist Risk", icon: UserX, angle: 210, color: "text-risk-critical" },
];

const RADIUS = 44; // % of container from center

function pos(angle: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    left: `${50 + RADIUS * Math.cos(rad)}%`,
    top: `${50 + RADIUS * Math.sin(rad)}%`,
  };
}

export function RiskOrbit() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto aspect-square w-[min(100%,560px)]"
      aria-hidden="true"
    >
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-[8%] rounded-full bg-brand-500/10 blur-3xl" />

      {/* radar sweep */}
      <div className="absolute inset-0 overflow-hidden rounded-full opacity-70">
        <div className="gf-orbit-sweep absolute inset-0" />
      </div>

      {/* concentric rings */}
      <div className="gf-spin-slow absolute inset-0 rounded-full border border-white/10" />
      <div className="gf-spin-rev absolute inset-[13%] rounded-full border border-white/[0.08]" />
      <div className="gf-spin-med absolute inset-[26%] rounded-full border border-brand-500/25" />
      <div className="absolute inset-[26%] rounded-full gf-pulse-ring border border-brand-400/10" />

      {/* dotted tick ring */}
      <div
        className="gf-spin-slow absolute inset-[6%] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, transparent 49.4%, rgba(255,255,255,0.10) 49.5%, transparent 50%)",
          maskImage:
            "repeating-conic-gradient(from 0deg, black 0deg 2deg, transparent 2deg 10deg)",
          WebkitMaskImage:
            "repeating-conic-gradient(from 0deg, black 0deg 2deg, transparent 2deg 10deg)",
        }}
      />

      {/* center score */}
      <div className="absolute left-1/2 top-1/2 flex aspect-square w-[42%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/10 bg-surface/70 text-center shadow-card backdrop-blur-md">
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
          Risk Score
        </div>
        <div className="font-display text-4xl font-bold text-risk-high sm:text-5xl">
          <CountUp value={72} />
        </div>
        <div className="mt-1 rounded-full border border-risk-high/30 bg-risk-high/10 px-2.5 py-0.5 text-[10px] font-medium text-risk-high sm:text-xs">
          High Risk
        </div>
      </div>

      {/* orbit nodes */}
      {NODES.map((node, i) => (
        <motion.div
          key={node.label}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={pos(node.angle)}
          initial={reduce ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.5 + i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-surface/80 px-2.5 py-1.5 shadow-card backdrop-blur-md sm:gap-2 sm:px-3 sm:py-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full bg-white/5 ${node.color} sm:h-7 sm:w-7`}
            >
              <node.icon className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-medium text-slate-200 sm:text-xs">
              {node.label}
            </span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
