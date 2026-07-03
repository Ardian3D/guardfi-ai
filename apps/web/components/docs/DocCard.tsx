import * as React from "react";
import { cn } from "@/lib/utils";

/** Light drop-in replacement for the dark ui/Card, used on the light docs pages. */
export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("card-soft rounded-2xl", className)}>{children}</div>
  );
}
