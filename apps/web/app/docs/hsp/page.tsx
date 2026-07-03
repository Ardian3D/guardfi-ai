import * as React from "react";
import { Coins } from "lucide-react";
import { Card } from "@/components/docs/DocCard";
import { Badge } from "@/components/docs/DocBadge";
import { DocHeader, CheckList } from "@/components/docs/DocShared";

export default function HspPage() {
  return (
    <>
      <DocHeader
        eyebrow="04 — HSP Premium Unlock"
        title="Token-Gated Premium Reports"
        description="Basic scans and on-chain verification are free. The full AI report is unlocked with HSP."
      />

      <Card className="p-6">
        <p className="text-sm leading-relaxed text-slate-600">
          Every scan produces a deterministic risk score, indicators, and a
          public on-chain proof for free. The full AI report is a premium
          product: unlock it by settling a small HSP payment. Payment is handled
          by an adapter, so the provider can be swapped without touching the app.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Badge tone="brand">
            <Coins className="h-3 w-3" /> 25 HSP per premium report
          </Badge>
          <Badge tone="neutral">Per-wallet unlock</Badge>
          <Badge tone="neutral">Off-chain report</Badge>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="font-display font-bold text-slate-900">Adapter design</h2>
        <p className="mt-2 text-sm text-slate-600">
          HSP logic is isolated in <code className="font-mono">lib/hsp</code>{" "}
          behind a single <code className="font-mono">HspAdapter</code>{" "}
          interface (createPaymentIntent, startPayment, getPaymentStatus,
          isPremiumUnlocked). The UI only talks to a service that selects the
          active adapter — nothing else depends on a concrete HSP SDK.
        </p>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="font-display font-bold text-slate-900">Mock vs production</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <Badge tone="medium">Mock mode</Badge>
            <p className="mt-2 text-sm text-slate-600">
              Enabled with{" "}
              <code className="font-mono">NEXT_PUBLIC_HSP_MODE=mock</code>.
              Simulates the payment lifecycle in the browser for local demos.
              Clearly labeled “Mock HSP Mode” in the UI — no real value moves.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <Badge tone="brand">Production mode</Badge>
            <p className="mt-2 text-sm text-slate-600">
              Uses the real adapter. HSP secrets stay server-side; settlement is
              verified by the provider. Do not use mock mode in production.
            </p>
          </div>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="font-display font-bold text-slate-900">
          What payment does & does not touch
        </h2>
        <div className="mt-4">
          <CheckList
            items={[
              "Payment unlocks the off-chain AI report for your wallet only.",
              "Payment does NOT alter the on-chain report hash (Phase 5).",
              "The on-chain registry remains a public proof layer for anyone.",
              "Verification stays public and never requires a wallet or payment.",
            ]}
          />
        </div>
        <p className="mt-4 text-xs text-slate-400">
          MVP note: unlock state is stored client-side for convenience.
          Production must verify settlement server-side before granting access.
        </p>
      </Card>
    </>
  );
}
