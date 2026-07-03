import * as React from "react";
import { Boxes, Copy, ExternalLink } from "lucide-react";
import { Card } from "@/components/docs/DocCard";
import { Badge } from "@/components/docs/DocBadge";
import { DocHeader } from "@/components/docs/DocShared";
import { REGISTRY_CONTRACT_ADDRESS } from "@/lib/mock";

export default function ContractPage() {
  return (
    <>
      <DocHeader
        eyebrow="06 — Smart Contract"
        title="GuardFiReportRegistry"
        description="All verification records are anchored on the GuardFiReportRegistry contract deployed on HashKey Chain."
      />

      <Card className="p-6">
        <p className="text-sm leading-relaxed text-slate-600">
          All verification records are anchored on the GuardFiReportRegistry
          contract deployed on HashKey Chain. It is a registry contract — GuardFi
          AI does not have its own token.
        </p>
        <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-blue-700">
              GuardFiReportRegistry
            </span>
            <Badge tone="low">Verified</Badge>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
            <span className="break-all font-mono text-xs text-slate-600">
              {REGISTRY_CONTRACT_ADDRESS}
            </span>
            <Copy className="h-4 w-4 shrink-0 text-slate-400" />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Boxes className="h-3.5 w-3.5" /> HashKey Chain Testnet
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-500">
              View on HashKey Explorer <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </Card>
    </>
  );
}
