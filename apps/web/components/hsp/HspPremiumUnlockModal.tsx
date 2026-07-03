"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  FileText,
  Coins,
  CheckCircle2,
  Info,
  Lock,
  Loader2,
  AlertTriangle,
  Boxes,
  ExternalLink,
  FlaskConical,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { isMockMode, getPremiumProduct, PREMIUM_BENEFITS } from "@/lib/hsp/config";
import { createIntent, settleIntent } from "@/lib/hsp/service";
import { getPremiumUnlock } from "@/lib/hsp/storage";
import { explorerTxUrl } from "@/lib/contracts/registry";
import type { PaymentStatus } from "@/lib/hsp/types";

type Phase = "idle" | "creating" | "pending" | "settled" | "failed";

const STEPS: { key: PaymentStatus; label: string }[] = [
  { key: "CREATED", label: "Created" },
  { key: "PENDING", label: "Pending" },
  { key: "SETTLED", label: "Settled" },
];

export function HspPremiumUnlockModal({
  open,
  onClose,
  scanId,
  walletAddress,
  onUnlocked,
}: {
  open: boolean;
  onClose: () => void;
  scanId: string;
  walletAddress: string;
  onUnlocked?: () => void;
}) {
  const mock = isMockMode();
  const product = getPremiumProduct(scanId);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [error, setError] = React.useState<string | null>(null);
  const [txHash, setTxHash] = React.useState<string | undefined>();

  // If already unlocked, reflect settled state.
  React.useEffect(() => {
    if (!open) return;
    const existing = getPremiumUnlock(scanId, walletAddress);
    if (existing?.status === "UNLOCKED") {
      setPhase("settled");
      setTxHash(existing.txHash);
    } else {
      setPhase("idle");
      setError(null);
      setTxHash(undefined);
    }
  }, [open, scanId, walletAddress]);

  if (!open) return null;

  const activeStepIndex =
    phase === "settled" ? 2 : phase === "pending" || phase === "creating" ? 1 : 0;

  async function handlePay() {
    setError(null);
    setPhase("creating");
    try {
      const intent = await createIntent(scanId, walletAddress);
      setPhase("pending");
      const settled = await settleIntent(intent.intentId);
      if (settled.status !== "SETTLED") {
        throw new Error("Payment was not settled.");
      }
      setTxHash(settled.txHash);
      setPhase("settled");
      onUnlocked?.();
    } catch (e) {
      setPhase("failed");
      setError(e instanceof Error ? e.message : "Payment failed.");
    }
  }

  const busy = phase === "creating" || phase === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={busy ? undefined : onClose} />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200 p-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-xl font-bold text-slate-900">
                Unlock Premium Report
              </h2>
              {mock && (
                <Badge tone="medium">
                  <FlaskConical className="h-3 w-3" /> Mock HSP Mode
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {mock
                ? "Simulated unlock for demo — no real payment is made."
                : "Pay with HSP to unlock the full AI risk report."}
            </p>
          </div>
          <button
            type="button"
            onClick={busy ? undefined : onClose}
            aria-label="Close"
            disabled={busy}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
          {/* Left: product + payment */}
          <div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Product</div>
                  <div className="font-semibold text-slate-900">{product.name}</div>
                </div>
              </div>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-500">Wallet</dt>
                  <dd className="font-mono text-xs text-slate-700">
                    {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-slate-500">
                    <Boxes className="h-4 w-4 text-blue-600" /> Network
                  </dt>
                  <dd className="text-slate-700">HashKey Chain</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-slate-500">
                    <Coins className="h-4 w-4 text-blue-600" /> Amount
                  </dt>
                  <dd className="font-semibold text-slate-900">
                    {product.amount} {product.currency}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Status stepper */}
            <div className="mt-4">
              <div className="text-xs text-slate-400">Payment Status</div>
              <div className="mt-3 flex items-center">
                {STEPS.map((step, i) => (
                  <React.Fragment key={step.key}>
                    <div className="flex flex-col items-center">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                          i <= activeStepIndex
                            ? "border-blue-500 bg-blue-500"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {i <= activeStepIndex && (
                          <span className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </span>
                      <span
                        className={`mt-1.5 text-xs ${
                          i <= activeStepIndex ? "text-blue-700" : "text-slate-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <span
                        className={`mx-1 h-px flex-1 ${
                          i < activeStepIndex ? "bg-blue-500" : "bg-slate-200"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {phase === "settled" ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" /> Premium Report Unlocked
                </div>
                {txHash && !txHash.startsWith("0xmock") && (
                  <a
                    href={explorerTxUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-blue-600 hover:bg-slate-100"
                  >
                    View settlement on Explorer <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link href={`/reports/${scanId}`} className="block">
                  <Button className="w-full" size="lg">
                    View Full Report <ExternalLink className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Button className="mt-4 w-full" size="lg" onClick={handlePay} disabled={busy}>
                  {busy ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {phase === "creating" ? "Creating…" : "Settling…"}
                    </>
                  ) : (
                    <>
                      <Coins className="h-5 w-5" />
                      {mock ? "Unlock in Mock Mode" : "Pay with HSP"}
                    </>
                  )}
                </Button>
                <Button variant="outline" className="mt-3 w-full" size="lg" onClick={onClose} disabled={busy}>
                  Cancel
                </Button>
              </>
            )}
          </div>

          {/* Right: benefits */}
          <div>
            <div className="text-sm font-semibold text-slate-900">You will unlock</div>
            <ul className="mt-3 space-y-2.5">
              {PREMIUM_BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2.5 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> {b}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              Payment does not change the on-chain report hash. The on-chain
              registry remains a public proof layer; only the full off-chain
              report is gated.
            </div>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <Lock className="h-3 w-3" /> Off-chain report · per-wallet unlock
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
