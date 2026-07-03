import * as React from "react";
import { Info } from "lucide-react";
import { DocHeader } from "@/components/docs/DocShared";

export default function DisclaimerPage() {
  return (
    <>
      <DocHeader
        eyebrow="07 — Disclaimer"
        title="Important Limitations"
        description="What GuardFi AI does and does not guarantee."
      />

      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
        <p className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
          <span>
            GuardFi AI provides automated analysis and does not guarantee the
            absence of vulnerabilities. Reports are read-only risk analysis, not
            financial advice. Always conduct your own due diligence before
            interacting with any smart contract.
          </span>
        </p>
      </div>
    </>
  );
}
