import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary";

/**
 * Premium landing CTA. Renders a Next.js Link styled as a rounded pill.
 * - primary: gradient fill, soft animated glow, hover lift + brighten
 * - secondary: glass with gradient hairline border, hover fill
 * Focus-visible ring for accessibility; transitions are transform/opacity only
 * to stay smooth.
 */
export function LandingButton({
  href,
  children,
  variant = "primary",
  className,
  "aria-label": ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  "aria-label"?: string;
}) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-[transform,box-shadow,background-color] duration-300 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:-translate-y-0.5";

  if (variant === "primary") {
    return (
      <Link href={href} aria-label={ariaLabel} className={cn(base, "text-white", className)}>
        {/* gradient fill + glow */}
        <span className="absolute inset-0 rounded-full bg-brand-gradient shadow-glow transition-all duration-300 group-hover:shadow-glow-lg group-hover:brightness-110" />
        {/* sheen sweep on hover */}
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 group-hover:translate-x-[300%]" />
        </span>
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        base,
        "border border-border-strong bg-white/[0.04] text-slate-100 backdrop-blur-sm hover:border-brand-500/40 hover:bg-white/[0.08]",
        className
      )}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}
