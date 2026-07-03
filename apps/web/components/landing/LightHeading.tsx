import * as React from "react";
import { Reveal } from "./motion";

/** Centered light-theme section heading: pill label + bold title + subtitle. */
export function LightHeading({
  label,
  title,
  highlight,
  subtitle,
}: {
  label: string;
  title: string;
  highlight?: string;
  subtitle?: string;
}) {
  return (
    <Reveal>
      <div className="mx-auto max-w-2xl text-center">
        <span className="pill-label inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-600">
          {label}
        </span>
        <h2 className="mt-5 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl md:text-[2.6rem]">
          {title}
          {highlight && <span className="text-slate-400"> {highlight}</span>}
        </h2>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-xl text-slate-500">{subtitle}</p>
        )}
      </div>
    </Reveal>
  );
}
