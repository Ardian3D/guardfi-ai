"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Unlock, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useWallet } from "@/lib/wallet";
import { isUnlocked } from "@/lib/hsp/service";
import { PREMIUM_PRICE, PREMIUM_CURRENCY } from "@/lib/hsp/config";
import { HspPremiumUnlockModal } from "./HspPremiumUnlockModal";

export function PremiumUnlockButton({ scanId }: { scanId: string }) {
  const router = useRouter();
  const wallet = useWallet();
  const [mounted, setMounted] = React.useState(false);
  const [unlocked, setUnlocked] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setUnlocked(isUnlocked(scanId, wallet.address));
  }, [scanId, wallet.address]);

  function handleClick() {
    if (!wallet.correctNetwork) {
      router.push(`/connect?redirect=/scan/${scanId}`);
      return;
    }
    setOpen(true);
  }

  if (mounted && unlocked) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
          <CheckCircle2 className="h-5 w-5" /> Premium Report Unlocked
        </div>
        <Link href={`/reports/${scanId}`} className="mt-4 block">
          <Button size="lg" className="w-full">
            View Full Report <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <>
      <Button
        size="lg"
        className="w-full flex-col !h-auto py-3"
        onClick={handleClick}
      >
        <span className="flex items-center gap-2">
          <Lock className="h-4 w-4" /> Unlock Premium Report
        </span>
        <span className="text-xs font-normal text-white/80">
          {PREMIUM_PRICE} {PREMIUM_CURRENCY} · full AI report
        </span>
      </Button>

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
