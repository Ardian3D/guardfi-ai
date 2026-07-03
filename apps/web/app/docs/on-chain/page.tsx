import * as React from "react";
import { Boxes, Database, ShieldCheck } from "lucide-react";
import { Card } from "@/components/docs/DocCard";
import { DocHeader, CheckList } from "@/components/docs/DocShared";

const ONCHAIN = [
  "Contract address & chain ID",
  "Risk score & severity counts",
  "Report hash (IPFS CID)",
  "Analyzer version & timestamp",
  "Report signature (GuardFi AI)",
];

const OFFCHAIN = [
  "Full vulnerability descriptions & recommendations",
  "Code snippets & line references",
  "AI reasoning & analysis metadata",
  "User identity & scan history",
];

const VERIFY_STEPS = [
  "Get the report hash from the blockchain.",
  "Fetch the report JSON from IPFS using the hash.",
  "Validate the signature using GuardFi AI's public key.",
];

export default function OnChainPage() {
  return (
    <>
      <DocHeader
        eyebrow="03 — On-Chain Proof"
        title="What Goes On-Chain vs Off-Chain"
        description="A minimal, immutable proof lives on-chain while detailed analysis stays off-chain to protect privacy and reduce cost."
      />

      <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
        <Card className="flex h-full flex-col p-6">
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-blue-600" />
            <h2 className="font-display font-bold text-slate-900">Stored On-Chain</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            A minimal, immutable proof — enough to guarantee integrity without
            exposing sensitive data.
          </p>
          <div className="mt-4">
            <CheckList items={ONCHAIN} />
          </div>
        </Card>

        <Card className="flex h-full flex-col p-6">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            <h2 className="font-display font-bold text-slate-900">Kept Off-Chain</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Detailed analysis stays off-chain to protect privacy and reduce
            on-chain costs.
          </p>
          <div className="mt-4">
            <ul className="space-y-2.5">
              {OFFCHAIN.map((li) => (
                <li
                  key={li}
                  className="flex items-start gap-2.5 text-sm text-slate-600"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  {li}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <Card className="mt-5 p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-blue-600" />
          <h2 className="font-display font-bold text-slate-900">How Verification Works</h2>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {VERIFY_STEPS.map((s, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                {i + 1}
              </span>
              <p className="mt-3 text-sm text-slate-600">{s}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-400">
          If all checks pass, the report is authentic and untampered.
        </p>
      </Card>
    </>
  );
}
