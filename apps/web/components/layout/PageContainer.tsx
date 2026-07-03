import * as React from "react";
import { cn } from "@/lib/utils";

export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

/** Standard app-page header with an eyebrow label + gradient title. */
export function PageHeading({
  eyebrow,
  icon: Icon,
  title,
  highlight,
  subtitle,
}: {
  eyebrow?: string;
  icon?: React.ElementType;
  title: string;
  highlight?: string;
  subtitle?: string;
}) {
  return (
    <div>
      {eyebrow && (
        <div className="mb-3 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-blue-600">
          {Icon && <Icon className="h-4 w-4" />}
          {eyebrow}
        </div>
      )}
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        {title} {highlight && <span className="text-slate-400">{highlight}</span>}
      </h1>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-slate-500">{subtitle}</p>
      )}
    </div>
  );
}
