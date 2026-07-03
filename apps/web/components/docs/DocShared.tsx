import * as React from "react";
import { CheckCircle2 } from "lucide-react";

/** Per-page header: eyebrow label + title + optional description. */
export function DocHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-8">
      <div className="text-xs font-semibold uppercase tracking-wider text-blue-600">
        {eyebrow}
      </div>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-slate-500">{description}</p>
      )}
    </header>
  );
}

/** Checklist with green check icons. */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((li) => (
        <li key={li} className="flex items-start gap-2.5 text-sm text-slate-600">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
          {li}
        </li>
      ))}
    </ul>
  );
}
