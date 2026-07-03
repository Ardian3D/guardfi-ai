import * as React from "react";
import { ScanLine, FileText, Anchor } from "lucide-react";
import { Card } from "@/components/docs/DocCard";
import { DocHeader } from "@/components/docs/DocShared";

const WORKFLOW = [
  { icon: ScanLine, title: "Scan", text: "Submit a token or contract address." },
  { icon: FileText, title: "Report", text: "Get an AI risk report with a 0–100 score." },
  { icon: Anchor, title: "Anchor", text: "Save a verifiable proof on-chain." },
];

export default function DocsOverviewPage() {
  return (
    <>
      <DocHeader
        eyebrow="01 — Overview"
        title="What is GuardFi AI?"
        description="Understand how GuardFi AI analyzes smart contracts, calculates risk, and provides verifiable on-chain proof."
      />

      <Card className="p-6">
        <p className="text-sm leading-relaxed text-slate-600">
          GuardFi AI is an AI-powered smart contract security analysis platform
          on HashKey Chain. It scans contracts, detects vulnerabilities,
          calculates a deterministic risk score, and issues a verifiable report.
          Every report is signed and anchored on-chain for transparent,
          tamper-proof verification.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {WORKFLOW.map((w, i) => (
            <div
              key={w.title}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
                  <w.icon className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-xs text-slate-400">Step {i + 1}</span>
              </div>
              <div className="mt-3 text-sm font-semibold text-slate-900">
                {w.title}
              </div>
              <div className="mt-1 text-xs text-slate-500">{w.text}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
