import Link from "next/link";
import {
  ArrowLeft,
  Boxes,
  Copy,
  ExternalLink,
  ShieldCheck,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkline } from "@/components/ui/Sparkline";
import { targetHistory, RiskLevel } from "@/lib/mock";

function tone(level: RiskLevel) {
  return level.toLowerCase() as "low" | "medium" | "high" | "critical";
}

export default function TargetHistoryPage() {
  const t = targetHistory;
  return (
    <PageContainer className="py-10">
      <Link
        href="/scan"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Scanner
      </Link>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
        Target <span className="text-blue-600">History</span>
      </h1>
      <p className="mt-3 text-slate-400">
        View the complete analysis history and on-chain proof for a contract.
      </p>

      {/* Summary */}
      <Card className="mt-8 grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="text-xs text-slate-500">Target Contract Address</div>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-sm text-slate-900">
            {t.addressShort}
            <Copy className="h-3.5 w-3.5 text-slate-500" />
          </div>
          <button className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
            View on Explorer <ExternalLink className="h-3 w-3" />
          </button>
        </div>
        <div>
          <div className="text-xs text-slate-500">Latest Risk Score</div>
          <div className="mt-1 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-risk-low" />
            <span className="text-2xl font-bold text-slate-900">{t.latestScore}</span>
            <span className="text-slate-500">/ 100</span>
          </div>
          <div className="text-xs text-risk-low">{t.latestLevel} Risk</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Latest Risk Level</div>
          <div className="mt-1">
            <Badge tone={tone(t.latestLevel)}>{t.latestLevel} Risk</Badge>
          </div>
          <div className="mt-1 text-xs text-slate-500">Updated {t.updated}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Network</div>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-900">
            <Boxes className="h-4 w-4 text-blue-600" /> {t.network}
            <Badge tone="low">Connected</Badge>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left/main */}
        <div className="space-y-6 lg:col-span-2">
          {/* Trend */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">Risk Score Trend</h3>
                <Info className="h-4 w-4 text-slate-500" />
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-100/50 px-3 py-1.5 text-xs text-slate-600">
                All Time ▾
              </div>
            </div>
            <div className="mt-4 h-56">
              <Sparkline
                data={t.trend.map((p) => p.score)}
                color="#5b5ef5"
                showDots
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              {t.trend.map((p) => (
                <span key={p.date}>{p.date}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-risk-high" /> High Risk (75-100)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-risk-medium" /> Medium Risk (40-74)
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full bg-risk-low" /> Low Risk (0-39)
              </span>
            </div>
          </Card>

          {/* Report history */}
          <Card className="p-6">
            <h3 className="font-semibold text-slate-900">Report History</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                    <th className="py-3 pr-4">Report ID</th>
                    <th className="py-3 pr-4">Risk Score</th>
                    <th className="py-3 pr-4">Status</th>
                    <th className="py-3 pr-4">Submitted By</th>
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {t.reports.map((r) => (
                    <tr key={r.id} className="border-b border-slate-200/60 last:border-0">
                      <td className="py-3 pr-4 font-mono text-xs text-blue-600">
                        {r.id}
                      </td>
                      <td className="py-3 pr-4 text-risk-low">{r.score} / 100</td>
                      <td className="py-3 pr-4">
                        <Badge tone={tone(r.level)}>{r.level} Risk</Badge>
                      </td>
                      <td className="py-3 pr-4 font-mono text-xs text-slate-400">
                        {r.by}
                      </td>
                      <td className="py-3 pr-4 text-slate-400">{r.date}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2 text-slate-400">
                          <ShieldCheck className="h-4 w-4 hover:text-slate-900" />
                          <ExternalLink className="h-4 w-4 hover:text-slate-900" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <span>Showing 1 to 5 of 8 reports</span>
              <div className="flex items-center gap-1">
                <button className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="rounded-lg border border-blue-300/40 bg-blue-500/10 px-2.5 py-1 text-blue-700">
                  1
                </button>
                <button className="rounded-lg border border-slate-200 px-2.5 py-1 hover:bg-slate-100">
                  2
                </button>
                <button className="rounded-lg border border-slate-200 p-1.5 hover:bg-slate-100">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Insights */}
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">Latest Report Insights</h3>
              <Info className="h-4 w-4 text-slate-500" />
            </div>
            <div className="mt-4 space-y-4">
              {t.insights.map((ins) => (
                <div key={ins.title} className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-risk-low" />
                  <div>
                    <div className="text-sm font-medium text-slate-900">
                      {ins.title}
                    </div>
                    <div className="text-xs text-slate-400">{ins.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/reports/RPT-20250525-1243" className="mt-4 block">
              <Button variant="outline" className="w-full">
                View Full Report <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>

          {/* On-chain proof summary */}
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-900">On-Chain Proof Summary</h3>
              <Info className="h-4 w-4 text-slate-500" />
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Latest Report ID</dt>
                <dd className="font-mono text-xs text-slate-700">
                  {t.onChainProof.latestReportId}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Stored On-Chain</dt>
                <dd className="flex items-center gap-1.5 text-risk-low">
                  Yes <ShieldCheck className="h-4 w-4" />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Transaction Hash</dt>
                <dd className="flex items-center gap-1 font-mono text-xs text-blue-600">
                  {t.onChainProof.transactionHash}
                  <ExternalLink className="h-3 w-3" />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Block Number</dt>
                <dd className="text-slate-700">{t.onChainProof.blockNumber}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Timestamp</dt>
                <dd className="text-slate-700">{t.onChainProof.timestamp}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Data Integrity</dt>
                <dd className="flex items-center gap-1.5 text-risk-low">
                  {t.onChainProof.dataIntegrity}
                  <ShieldCheck className="h-4 w-4" />
                </dd>
              </div>
            </dl>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link href="/verify">
                <Button className="w-full" size="sm">
                  <ShieldCheck className="h-4 w-4" /> Verify Latest
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="w-full">
                View on Explorer <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
