import * as React from "react";

export function SectionHeading({
  index,
  eyebrow,
  title,
  highlight,
  subtitle,
  center = true,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {(index || eyebrow) && (
        <div
          className={`mb-4 flex items-center gap-2.5 ${
            center ? "justify-center" : ""
          }`}
        >
          <span className="h-4 w-px bg-gradient-to-b from-brand-400 to-transparent" />
          {index && (
            <span className="font-mono text-xs text-brand-300">{index}</span>
          )}
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
        {title}{" "}
        {highlight && <span className="brand-gradient-text">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-slate-400 ${center ? "mx-auto max-w-xl" : "max-w-xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
