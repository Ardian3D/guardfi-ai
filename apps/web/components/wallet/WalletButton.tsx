"use client";

import * as React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Wallet, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { REQUIRED_CHAIN_ID } from "@/lib/chains";

const baseClass =
  "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-colors";

/**
 * WalletButton — real wallet state via RainbowKit/wagmi.
 * - Disconnected → "Connect Wallet" (opens RainbowKit connect modal)
 * - Wrong network → "Wrong Network" (opens chain modal)
 * - Connected + correct chain → shortened address (opens account modal)
 * No address is ever hardcoded.
 */
export function WalletButton({ className }: { className?: string }) {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!ready) {
          // Placeholder during hydration to avoid mismatch / layout shift.
          return (
            <div
              aria-hidden
              className={cn(
                baseClass,
                "border-slate-200 bg-white text-slate-400 opacity-0",
                className
              )}
            >
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </div>
          );
        }

        if (!connected) {
          return (
            <button
              type="button"
              onClick={openConnectModal}
              className={cn(
                baseClass,
                "border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
                className
              )}
            >
              <Wallet className="h-4 w-4 text-slate-500" />
              <span>Connect Wallet</span>
            </button>
          );
        }

        if (chain.unsupported || chain.id !== REQUIRED_CHAIN_ID) {
          return (
            <button
              type="button"
              onClick={openChainModal}
              className={cn(
                baseClass,
                "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100",
                className
              )}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Wrong Network</span>
            </button>
          );
        }

        return (
          <button
            type="button"
            onClick={openAccountModal}
            className={cn(
              baseClass,
              "border-border bg-surface-muted/70 text-slate-200 hover:bg-surface-raised",
              className
            )}
            title="Account"
          >
            <Wallet className="h-4 w-4 text-blue-600" />
            <span className="font-mono">{account.displayName}</span>
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
