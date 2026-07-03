import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/docs/DocCard";
import { Badge } from "@/components/docs/DocBadge";
import { DocHeader } from "@/components/docs/DocShared";

const SCORING = [
  "Vulnerability detection & pattern matching",
  "Code complexity & function analysis",
  "Privilege & access control evaluation",
  "External calls & dependency checks",
  "Best practices & standard compliance",
];

const SCORE_BANDS = [
  { label: "Low", range: "0 – 39", tone: "low" as const },
  { label: "Medium", range: "40 – 74", tone: "medium" as const },
  { label: "High", range: "75 – 100", tone: "high" as const },
];

export default function RiskScoringPage() {
  return (
    <>
      <DocHeader
        eyebrow="02 — Risk Scoring"
        title="How the Risk Score Works"
        description="Our engine analyzes multiple dimensions of a contract and produces a 0–100 risk score with clear severity breakdowns."
      />

      <Card className="p-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {SCORING.map((li) => (
            <div
              key={li}
              className="flex items-start gap-2.5 text-sm text-slate-600"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              {li}
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-slate-200 pt-5">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Score Bands
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {SCORE_BANDS.map((b) => (
              <div
                key={b.label}
                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <Badge tone={b.tone}>{b.label}</Badge>
                <div className="mt-2 font-mono text-sm text-slate-700">
                  {b.range}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}
