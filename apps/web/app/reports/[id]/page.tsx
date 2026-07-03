"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Info } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { AiReportView } from "@/components/reports/AiReportView";
import { ReportOnChainStatus } from "@/components/reports/ReportOnChainStatus";
import { PremiumGate } from "@/components/hsp/PremiumGate";

export default function ReportDetailPage() {
  return (
    <PageContainer className="py-10">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <Badge tone="brand">
          <Sparkles className="h-3 w-3" /> AI Risk Report
        </Badge>
      </div>

      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        Risk <span className="text-slate-400">Report</span>
      </h1>
      <p className="mt-3 max-w-2xl text-slate-500">
        AI-generated explanation of the deterministic scan findings, with a
        verifiable on-chain proof. Automated risk intelligence — not a formal
        audit or financial advice.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main: AI report (premium-gated) */}
        <div className="lg:col-span-2">
          <PremiumGate>
            <AiReportView />
          </PremiumGate>
        </div>

        {/* Sidebar: on-chain proof + about */}
        <div className="space-y-6">
          <ReportOnChainStatus />

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              <h3 className="font-display font-bold text-slate-900">
                About This Report
              </h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              The full AI report is generated from the deterministic scan result
              and kept off-chain. Only a minimal commitment (report hash,
              target, score, metadata URI) is stored on-chain.
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
