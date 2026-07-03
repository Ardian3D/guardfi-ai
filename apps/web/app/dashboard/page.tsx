"use client";

import * as React from "react";
import Link from "next/link";
import {
  Plus,
  ShieldCheck,
  Box,
  FileText,
  Sparkles,
  Link2,
  Crown,
  AlertTriangle,
  ScanLine,
  Eye,
  ExternalLink,
  Boxes,
  Copy,
  Anchor,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useWallet, shortenAddress } from "@/lib/wallet";
import { buildDashboard } from "@/lib/dashboard/aggregate";
import type { DashboardData } from "@/lib/dashboard/types";
import type { RiskLevel } from "@/lib/risk-engine/types";

function levelTone(level: RiskLevel): "low" | "medium" | "high" | "critical" {
  switch (level) {
    case "LOW":
      return "low";
    case "MODERATE":
      return "medium";
    case "HIGH":
      return "high";
    case "CRITICAL":
      return "critical";
    default:
      return "low";
  }
}

function shortenHash(hash: string): string {
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const wallet = useWallet();
  const [mounted, setMounted] = React.useState(false);
  const [data, setData] = React.useState<DashboardData | null>(null);

  React.useEffect(() => {
    setMounted(true);
    setData(buildDashboard(wallet.address));
  }, [wallet.address]);

  const isEmpty = mounted && data && data.summary.totalScans === 0;

  return (
    <PageContainer className="py-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-slate-500">
            Track your scans, AI reports, premium unlocks, and on-chain proofs.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/scan">
            <Button>
              <Plus className="h-4 w-4" /> New Scan
            </Button>
          </Link>
          <Link href="/verify">
            <Button variant="outline">
              <ShieldCheck className="h-4 w-4" /> Verify Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Wallet card */}
      <Card className="mt-6 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-600" />
            <div>
              <div className="font-mono text-sm text-slate-900">
                {mounted && wallet.address
                  ? shortenAddress(wallet.address)
                  : "Not connected"}
              </div>
              <div className="text-xs text-slate-400">Connected wallet</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <Boxes className="h-4 w-4 text-blue-600" /> HashKey Chain
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
        </div>
      </Card>

      {!mounted || !data ? (
        <div className="mt-10 text-sm text-slate-400">Loading dashboard…</div>
      ) : isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {/* Summary cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
            <Stat icon={Box} label="Total Scans" value={data.summary.totalScans} />
            <Stat icon={Sparkles} label="AI Reports" value={data.summary.totalAiReports} />
            <Stat icon={Link2} label="On-Chain Proofs" value={data.summary.totalOnChainSubmissions} />
            <Stat icon={Crown} label="Premium Unlocks" value={data.summary.totalPremiumUnlocks} />
            <Stat
              icon={AlertTriangle}
              label="High / Critical"
              value={`${data.summary.highRiskCount} / ${data.summary.criticalRiskCount}`}
              tone="danger"
            />
          </div>

          {/* Recent scans */}
          <Card className="mt-6 p-6">
            <div className="flex items-center gap-2">
              <ScanLine className="h-5 w-5 text-blue-600" />
              <h2 className="font-display font-bold text-slate-900">Recent Scans</h2>
              <Badge tone="neutral" className="ml-auto">
                Local browser history
              </Badge>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-400">
                    <th className="py-3 pr-4">Target</th>
                    <th className="py-3 pr-4">Score</th>
                    <th className="py-3 pr-4">Level</th>
                    <th className="py-3 pr-4">AI</th>
                    <th className="py-3 pr-4">On-Chain</th>
                    <th className="py-3 pr-4">Premium</th>
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentScans.map((s) => (
                    <tr key={s.scanId} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 pr-4 font-mono text-xs text-slate-700">
                        {shortenAddress(s.targetAddress)}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-slate-900">{s.riskScore}</td>
                      <td className="py-3 pr-4">
                        <Badge tone={levelTone(s.riskLevel)}>{s.riskLevel}</Badge>
                      </td>
                      <td className="py-3 pr-4">
                        <YesNo ok={s.hasAiReport} />
                      </td>
                      <td className="py-3 pr-4">
                        <YesNo ok={s.hasOnChainSubmission} />
                      </td>
                      <td className="py-3 pr-4">
                        <YesNo ok={s.isPremiumUnlocked} />
                      </td>
                      <td className="py-3 pr-4 text-slate-400">{formatDate(s.createdAt)}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-1.5">
                          <Link
                            href={`/scan/${s.scanId}`}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
                            title="View result"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/reports/${s.scanId}`}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50"
                            title="View report"
                          >
                            <FileText className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* On-chain submissions */}
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Anchor className="h-5 w-5 text-blue-600" />
                <h2 className="font-display font-bold text-slate-900">On-Chain Proofs</h2>
              </div>
              {data.submissions.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">
                  No proofs anchored yet. Submit a scan result on-chain.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {data.submissions.map((sub) => (
                    <div
                      key={sub.scanId}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-slate-700">
                          {sub.reportId ? `Report #${sub.reportId}` : `Scan ${sub.scanId.slice(0, 10)}…`}
                        </span>
                        <Badge tone="low">Submitted</Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>Report hash</span>
                        <span className="font-mono text-slate-700">{shortenHash(sub.reportHash)}</span>
                      </div>
                      <a
                        href={sub.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-500"
                      >
                        {shortenHash(sub.txHash)} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Premium unlocks */}
            <Card className="p-6">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-blue-600" />
                <h2 className="font-display font-bold text-slate-900">Premium Unlocks</h2>
              </div>
              {data.premiumUnlocks.length === 0 ? (
                <p className="mt-3 text-sm text-slate-400">
                  No premium reports unlocked for this wallet yet.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {data.premiumUnlocks.map((u) => (
                    <div
                      key={u.scanId}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm"
                    >
                      <div className="flex items-center justify-between">
                        <Link
                          href={`/reports/${u.scanId}`}
                          className="font-mono text-xs text-blue-600 hover:text-blue-500"
                        >
                          {u.scanId.slice(0, 14)}…
                        </Link>
                        <div className="flex items-center gap-2">
                          <Badge tone={u.source === "mock" ? "medium" : "brand"}>
                            {u.source === "mock" ? "Mock" : "HSP"}
                          </Badge>
                          <Badge tone="low">{u.status}</Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-400">
                        {formatDate(u.unlockedAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </>
      )}
    </PageContainer>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType;
  label: string;
  value: number | string;
  tone?: "danger";
}) {
  return (
    <Card className="p-4">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          tone === "danger" ? "bg-rose-50" : "bg-blue-50"
        }`}
      >
        <Icon className={`h-4 w-4 ${tone === "danger" ? "text-rose-500" : "text-blue-600"}`} />
      </div>
      <div className="mt-3 text-xs text-slate-500">{label}</div>
      <div className="font-display text-2xl font-bold text-slate-900">{value}</div>
    </Card>
  );
}

function YesNo({ ok }: { ok: boolean }) {
  return ok ? (
    <Badge tone="low">Yes</Badge>
  ) : (
    <span className="text-xs text-slate-400">—</span>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
        <ScanLine className="h-6 w-6 text-slate-400" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-bold text-slate-900">
        No activity yet
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Run your first contract scan to populate the dashboard.
      </p>
      <Link href="/scan" className="mt-6 inline-block">
        <Button size="lg">
          <ScanLine className="h-5 w-5" /> Start Scanning
        </Button>
      </Link>
    </div>
  );
}
