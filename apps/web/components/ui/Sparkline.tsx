import * as React from "react";

/**
 * Sparkline — lightweight SVG line chart with an optional gradient fill.
 * Used for risk score trends / activity previews. Pure static rendering.
 */
export function Sparkline({
  data,
  color = "#f43f5e",
  width = 320,
  height = 120,
  fill = true,
  showDots = false,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  showDots?: boolean;
}) {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 8;
  const stepX = (width - pad * 2) / (data.length - 1 || 1);

  const points = data.map((d, i) => {
    const x = pad + i * stepX;
    const y = pad + (1 - (d - min) / range) * (height - pad * 2);
    return { x, y };
  });

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const area =
    `${line} L ${points[points.length - 1].x.toFixed(1)} ${height - pad} ` +
    `L ${points[0].x.toFixed(1)} ${height - pad} Z`;

  const gradId = React.useId();

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-full w-full"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${gradId})`} />}
      <path d={line} fill="none" stroke={color} strokeWidth="2" />
      {showDots &&
        points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} />
        ))}
    </svg>
  );
}
