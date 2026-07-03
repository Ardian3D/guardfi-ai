"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useWallet } from "@/lib/wallet";
import { isUnlocked } from "@/lib/hsp/service";
import { isMockMode, PREMIUM_PRICE, PREMIUM_CURRENCY } from "@/lib/hsp/config";
import { HspPremiumUnlockModal } from "./HspPremiumUnlockModal";

/**
 * Gates premium (full AI report) content on /reports/[id] behind an HSP unlock
 * for the connected wallet. On-chain proof stays public (rendered separately).
 */
export function PremiumGate({ children }: { children: React.ReactNode }) {
  const params = useParams<{ id: string }>();
  const scanId = params?.id ?? "";
  const router = useRouter();
  const wallet = useWallet();

  const [mounted, setMounted] = React.useState(false);
  const [unlocked, setUnlocked] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setUnlocked(isUnlocked(scanId, wallet.address));
  }, [scanId, wallet.address]);

  function handleUnlock() {
    if (!wallet.correctNetwork) {
      router.push(`/connect?redirect=/reports/${scanId}`);
      return;
    }
    setOpen(true);
  }

  if (!mounted) {
    return <Card className="p-6 text-sm text-slate-400">Loading…</Card>;
  }

  if (unlocked) return <>{children}</>;

  return (
    <>
      <Card className="p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
          <Lock className="h-6 w-6 text-slate-400" />
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <h2 className="font-display text-lg font-bold text-slate-900">
            Premium report is locked.
          </h2>
          {isMockMode() && <Badge tone="medium">Mock HSP Mode</Badge>}
        </div>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Unlock the full AI report ({PREMIUM_PRICE} {PREMIUM_CURRENCY}) for your
          wallet. The on-chain proof below stays public either way.
        </p>
        <Button size="lg" className="mt-5" onClick={handleUnlock}>
          <Lock className="h-4 w-4" /> Unlock Premium Report
        </Button>
      </Card>

      {wallet.address && (
        <HspPremiumUnlockModal
          open={open}
          onClose={() => setOpen(false)}
          scanId={scanId}
          walletAddress={wallet.address}
          onUnlocked={() => setUnlocked(true)}
        />
      )}
    </>
  );
}
