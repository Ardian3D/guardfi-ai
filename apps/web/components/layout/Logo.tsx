import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * GuardFi AI logo mark — the shield/circuit artwork from /public/guardfi-logo.png.
 * The PNG is square, so width === height.
 */
export function Logo({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/guardfi-logo.png"
      alt="GuardFi AI logo"
      width={size}
      height={size}
      priority
      className={cn("h-8 w-8 object-contain", className)}
    />
  );
}

/** Icon mark + "GuardFi AI" wordmark. */
export function LogoWordmark({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Logo className={iconClassName} />
      <span className="text-lg font-bold tracking-tight text-white">
        Guard<span className="text-brand-400">Fi</span>{" "}
        <span className="brand-gradient-text">AI</span>
      </span>
    </div>
  );
}
