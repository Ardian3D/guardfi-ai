"use client";

import * as React from "react";
import { Boxes, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWallet } from "@/lib/wallet";

/**
 * NetworkBadge — reflects real wallet/chain state via wagmi.
 * - Disconnected → grey dot + "Disconnected"
 * - Connected + HashKey Chain (177) → green dot + "HashKey Chain"
 * - Connected + wrong chain → red + "Wrong Network"
 */
export function NetworkBadge({ className }: { className?: string }) {
  const { connected, correctNetwork, wrongNetwork } = useWallet();

  // Avoid SSR/hydration mismatch: render the disconnected state until mounted.
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const state: "disconnected" | "correct" | "wrong" =
    !mounted || !connected
      ? "disconnected"
      : correctNetwork
        ? "correct"
        : "wrong";

  if (state === "wrong" && wrongNetwork) {
    return (
      <div
        className={cn(
          "inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-600",
          className
        )}
      >
        <AlertTriangle className="h-4 w-4" />
        <span>Wrong Network</span>
      </div>
    );
  }

  const label = state === "correct" ? "HashKey Chain" : "Disconnected";

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm",
        className
      )}
    >
      <Boxes className="h-4 w-4 text-blue-600" />
      <span>{label}</span>
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          state === "correct" ? "bg-emerald-500" : "bg-slate-300"
        )}
      />
    </div>
  );
}
