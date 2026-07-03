import * as React from "react";

const colorMap: Record<string, string> = {
  low: "#22c55e",
  medium: "#f59e0b",
  high: "#f43f5e",
  critical: "#ef4444",
  info: "#3b82f6",
};

export interface DonutSegment {
  label: string;
  value: number;
  color: string; // key of colorMap
}

/** Donut chart built with SVG stroke dash segments. */
export function RiskDonut({
  segments,
  centerLabel,
  centerSub,
  size = 140,
  stroke = 16,
}: {
  segments: DonutSegment[];
  centerLabel: string | number;
  centerSub?: string;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;

  let offsetAccum = 0;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(15,23,42,0.06)"
          strokeWidth={stroke}
          fill="none"
        />
        {segments.map((seg, i) => {
          const fraction = seg.value / total;
          const dash = fraction * circumference;
          const gap = circumference - dash;
          const dashOffset = -offsetAccum;
          offsetAccum += dash;
          return (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colorMap[seg.color] ?? "#64748b"}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset={dashOffset}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{centerLabel}</span>
        {centerSub && (
          <span className="text-xs text-slate-400">{centerSub}</span>
        )}
      </div>
    </div>
  );
}

export { colorMap };
