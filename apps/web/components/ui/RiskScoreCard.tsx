import * as React from "react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/mock";

export function riskColor(level: RiskLevel): string {
  switch (level) {
    case "Low":
      return "#22c55e";
    case "Medium":
      return "#f59e0b";
    case "High":
      return "#f43f5e";
    case "Critical":
      return "#ef4444";
    default:
      return "#3b82f6";
  }
}

export function riskTextClass(level: RiskLevel): string {
  switch (level) {
    case "Low":
      return "text-risk-low";
    case "Medium":
      return "text-risk-medium";
    case "High":
      return "text-risk-high";
    case "Critical":
      return "text-risk-critical";
    default:
      return "text-risk-info";
  }
}

/** Circular gauge showing a 0-100 score. */
export function RiskGauge({
  score,
  level,
  size = 120,
  stroke = 10,
}: {
  score: number;
  level: RiskLevel;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = riskColor(level);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(15,23,42,0.08)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{score}</span>
        <span className="text-[10px] text-slate-400">/100</span>
      </div>
    </div>
  );
}

/**
 * RiskScoreCard — reusable large risk-score display used on scan results.
 */
export function RiskScoreCard({
  score,
  level,
  description,
  className,
}: {
  score: number;
  level: RiskLevel;
  description?: string;
  className?: string;
}) {
  const color = riskColor(level);
  return (
    <div className={cn("flex items-center gap-6", className)}>
      <div
        className="flex h-28 w-28 items-center justify-center rounded-full border"
        style={{
          borderColor: `${color}55`,
          boxShadow: `0 0 40px -8px ${color}66`,
        }}
      >
        <svg viewBox="0 0 24 24" className="h-12 w-12" style={{ color }}>
          <path
            fill="currentColor"
            d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Z"
            opacity={0.25}
          />
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Z"
          />
        </svg>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold" style={{ color }}>
            {score}
          </span>
          <span className="text-xl text-slate-500">/ 100</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={cn("text-lg font-semibold", riskTextClass(level))}
          >
            {level} Risk
          </span>
        </div>
        {description && (
          <p className="mt-2 max-w-xs text-sm text-slate-400">{description}</p>
        )}
      </div>
    </div>
  );
}
