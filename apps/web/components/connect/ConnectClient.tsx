"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSwitchChain } from "wagmi";
import {
  Wallet,
  Boxes,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useWallet, isAppReady } from "@/lib/wallet";
import { hashKeyChain, REQUIRED_CHAIN_ID } from "@/lib/chains";

const DEFAULT_REDIRECT = "/dashboard";

/** Only allow same-origin path redirects (avoid open-redirect). */
function safeRedirect(target: string | null): string {
  if (target && target.startsWith("/") && !target.startsWith("//")) {
    return target;
  }
  return DEFAULT_REDIRECT;
}

export function ConnectClient() {
  const router = useRouter();
  const params = useSearchParams();
  const wallet = useWallet();
  const { openConnectModal } = useConnectModal();
  const { switchChain, isPending: switching, error: switchError } =
    useSwitchChain();

  const redirectTo = safeRedirect(params.get("redirect"));
  const ready = isAppReady(wallet);

  const continueLabel =
    redirectTo === "/dashboard"
      ? "Continue to Dashboard"
      : redirectTo.startsWith("/scan")
        ? "Continue to Scanner"
        : "Continue to App";

  React.useEffect(() => {
    if (ready) router.replace(redirectTo);
  }, [ready, redirectTo, router]);

  const step1Done = wallet.connected;
  const step2Done = wallet.correctNetwork;

  function handleSwitch() {
    switchChain({ chainId: REQUIRED_CHAIN_ID });
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col justify-center px-4 py-16">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="clay-tile flex h-16 w-16 items-center justify-center rounded-2xl">
          <Image
            src="/guardfi-logo.png"
            alt="GuardFi AI logo"
            width={40}
            height={40}
            priority
            className="h-10 w-10 object-contain"
          />
        </div>
        <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-slate-900">
          Connect your wallet
        </h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Connect your wallet to continue to GuardFi AI. Switch to HashKey Chain
          to enter the app — your wallet stays in your control.
        </p>
      </div>

      <Card className="p-6">
        {/* Step 1 — connect */}
        <div className="flex items-start gap-4">
          <StepDot done={step1Done} index={1} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-slate-900">Connect wallet</span>
              {step1Done && (
                <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Authorize a connection to your browser wallet.
            </p>
            {!step1Done && (
              <button
                type="button"
                onClick={openConnectModal}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        <div className="my-5 border-t border-slate-200" />

        {/* Step 2 — network */}
        <div className="flex items-start gap-4">
          <StepDot done={step2Done} index={2} muted={!step1Done} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-slate-900">
                Add / switch to {hashKeyChain.name}
              </span>
              {step2Done && (
                <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500" />
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Adds {hashKeyChain.name} to your wallet if it isn&apos;t there
              yet, then switches to it.
            </p>
            {step1Done && !step2Done && (
              <button
                type="button"
                onClick={handleSwitch}
                disabled={switching}
                className="mt-3 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:bg-slate-50 disabled:opacity-60"
              >
                {switching ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Switching…
                  </>
                ) : (
                  <>Switch to {hashKeyChain.name}</>
                )}
              </button>
            )}
            {switchError && step1Done && !step2Done && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-rose-600">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Network request was rejected or failed. Please approve it in your
                wallet and try again.
              </p>
            )}
          </div>
        </div>

        <div className="my-5 border-t border-slate-200" />

        {/* Continue */}
        <button
          type="button"
          onClick={() => router.replace(redirectTo)}
          disabled={!ready}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {continueLabel} <ArrowRight className="h-4 w-4" />
        </button>
      </Card>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
        Read-only risk analysis. GuardFi AI never moves your funds.
      </div>

      <Link
        href="/"
        className="mt-6 text-center text-sm text-slate-500 transition-colors hover:text-slate-900"
      >
        ← Back to home
      </Link>
    </div>
  );
}

function StepDot({
  index,
  done,
  muted,
}: {
  index: number;
  done: boolean;
  muted?: boolean;
}) {
  return (
    <span
      className={[
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        done
          ? "bg-emerald-100 text-emerald-600"
          : muted
            ? "bg-slate-100 text-slate-400"
            : "bg-blue-100 text-blue-700",
      ].join(" ")}
    >
      {done ? <CheckCircle2 className="h-4 w-4" /> : index}
    </span>
  );
}
