"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ScanLine,
  Copy,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Info,
  ShieldCheck,
  AlertTriangle,
  FlaskConical,
} from "lucide-react";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { RiskScoreCard, riskTextClass } from "@/components/ui/RiskScoreCard";
import { getScanResult } from "@/lib/scan-storage";
import type { ScanResult } from "@/lib/risk-engine/types";
import { OnChainSubmitCard } from "@/components/reports/OnChainSubmitCard";
import { AiReportSection } from "@/components/reports/AiReportSection";
import { PremiumUnlockButton } from "@/components/hsp/PremiumUnlockButton";
import {
  toUiRiskLevel,
  severityToUiLevel,
  severityToTone,
} from "@/lib/risk-engine/ui";

function shorten(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function ScanResultPage() {
  const params = useParams<{ id: string }>();
  const scanId = params?.id ?? "";

  const [result, setResult] = React.useState<ScanResult | null>(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setResult(getScanResult(scanId));
    setLoaded(true);
  }, [scanId]);

  // Loading (pre-hydration read)
  if (!loaded) {
    return (
      <PageContainer className="py-10">
        <div className="flex min-h-[50vh] items-center justify-center text-slate-400">
          Loading scan result…
        </div>
      </PageContainer>
    );
  }

  // Empty / not found
  if (!result) {
    return (
      <PageContainer className="py-10">
        <div className="mx-auto max-w-md py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <AlertTriangle className="h-6 w-6 text-risk-high" />
          </div>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Scan result not found
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            This result isn&apos;t available in your browser session. Please run
            a new scan.
          </p>
          <Link href="/scan" className="mt-6 inline-block">
            <Button size="lg">
              <ScanLine className="h-5 w-5" /> Run a new scan
            </Button>
          </Link>
        </div>
      </PageContainer>
    );
  }

  const { metadata } = result;
  const uiLevel = toUiRiskLevel(result.riskLevel);

  return (
    <PageContainer className="py-10">
      <PageHeading
        eyebrow="Contract Scanner"
        icon={ScanLine}
        title="Risk Scan"
        highlight="Result"
        subtitle="Deterministic, best-effort analysis of the target contract. Review the findings below."
      />

      {metadata.demoMode && (
        <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-blue-200/30 bg-blue-500/5 p-3 text-sm text-brand-200">
          <FlaskConical className="h-4 w-4" />
          Demo mode — this is a labeled sample result, not a live on-chain read.
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Score overview */}
          <Card className="p-6">
            <RiskScoreCard
              score={result.riskScore}
              level={uiLevel}
              description={`Ruleset v${result.rulesetVersion} · ${result.riskIndicators.length} indicator(s) detected.`}
            />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-400">Target</span>
              <code className="rounded-lg border border-slate-200 bg-surface-muted/50 px-3 py-1.5 font-mono text-xs text-slate-700">
                {metadata.targetAddress}
              </code>
              <Badge tone="neutral">chainId {result.chainId}</Badge>
              <Badge tone="brand">{result.scanType}</Badge>
            </div>
          </Card>

          {/* AI report (DeepSeek with deterministic fallback) */}
          <AiReportSection scan={result} />

          {/* Top findings */}
          <Card className="p-6">
            <h2 className="font-semibold text-slate-900">
              Findings ({result.riskIndicators.length})
            </h2>
            <div className="mt-4 divide-y divide-border">
              {result.riskIndicators.map((indicator) => (
                <div
                  key={indicator.code}
                  className="flex items-start gap-4 py-4 first:pt-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                    <ShieldCheck
                      className={`h-4 w-4 ${riskTextClass(
                        severityToUiLevel(indicator.severity)
                      )}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {indicator.title}
                      </span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                        {indicator.code}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {indicator.description}
                    </p>
                    <p className="mt-1.5 text-xs text-slate-500">
                      <span className="text-slate-400">Evidence:</span>{" "}
                      <span className="font-mono">{indicator.evidence}</span>{" "}
                      · confidence {indicator.confidence}
                    </p>
                  </div>
                  <Badge tone={severityToTone(indicator.severity)}>
                    {indicator.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Scan details / metadata */}
          <Card className="p-6">
            <h2 className="font-semibold text-slate-900">Scan Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Token Name" value={metadata.tokenName ?? "unknown"} />
              <Row label="Token Symbol" value={metadata.tokenSymbol ?? "unknown"} />
              <Row
                label="Decimals"
                value={metadata.decimals?.toString() ?? "unknown"}
              />
              <Row
                label="Total Supply"
                value={metadata.totalSupply ? shorten(metadata.totalSupply) : "unknown"}
              />
              <Row label="Contract" value={shorten(metadata.targetAddress)} />
              <Row label="Bytecode" value={`${metadata.bytecodeSize} bytes`} />
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Proxy</dt>
                <dd className="text-slate-700">
                  {metadata.proxyDetected === true
                    ? "Detected"
                    : metadata.proxyDetected === false
                      ? "Not detected"
                      : "unknown"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Source Verified</dt>
                <dd className="text-slate-700">
                  {metadata.sourceVerified === true ? (
                    <span className="flex items-center gap-1.5 text-risk-low">
                      Yes <CheckCircle2 className="h-4 w-4" />
                    </span>
                  ) : metadata.sourceVerified === false ? (
                    "No"
                  ) : (
                    "unknown"
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Scan ID</dt>
                <dd className="flex items-center gap-1.5 font-mono text-xs text-slate-700">
                  {result.scanId} <Copy className="h-3.5 w-3.5 text-slate-500" />
                </dd>
              </div>
            </dl>
          </Card>

          {/* Real on-chain submit (wallet-signed) */}
          <OnChainSubmitCard scan={result} />

          {/* Premium unlock (HSP adapter) */}
          <PremiumUnlockButton scanId={result.scanId} />

          <Link href="/scan" className="block">
            <Button variant="outline" size="lg" className="w-full flex-col !h-auto py-3">
              <span className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" /> Back to Scan
              </span>
              <span className="text-xs font-normal text-slate-400">
                Start a new contract scan
              </span>
            </Button>
          </Link>
        </div>
      </div>

      <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
        <Info className="h-3 w-3" /> Best-effort, read-only risk analysis — not a
        formal audit or financial advice. Always do your own research.
      </p>
    </PageContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd className="truncate text-slate-700">{value}</dd>
    </div>
  );
}
