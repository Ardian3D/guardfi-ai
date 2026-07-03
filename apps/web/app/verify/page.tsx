"use client";

import * as React from "react";
import {
  ShieldCheck,
  FileText,
  Info,
  Clipboard,
  CheckCircle2,
  User,
  Target,
  Gauge,
  Clock,
  Hash,
  FileCode2,
  ExternalLink,
  GitCompare,
  AlertTriangle,
  Loader2,
  XCircle,
} from "lucide-react";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  getReadonlyClient,
  registryAbi,
  REGISTRY_ADDRESS,
  isRegistryConfigured,
  explorerAddressUrl,
} from "@/lib/contracts/registry";
import { findSubmissionByReportId } from "@/lib/reports/storage";

interface OnChainReport {
  id: bigint;
  reporter: string;
  target: string;
  score: number;
  reportHash: string;
  metadataURI: string;
  timestamp: bigint;
}

type HashMatch = "match" | "mismatch" | "none";

function formatTimestamp(ts: bigint): string {
  return new Date(Number(ts) * 1000).toUTCString();
}

export default function VerifyPage() {
  const [reportId, setReportId] = React.useState("");
  const [compareHash, setCompareHash] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<OnChainReport | null>(null);
  const [hashMatch, setHashMatch] = React.useState<HashMatch>("none");

  async function handleVerify() {
    setError(null);
    setResult(null);
    setHashMatch("none");

    if (!isRegistryConfigured() || !REGISTRY_ADDRESS) {
      setError("Registry contract address is not configured.");
      return;
    }
    const idTrim = reportId.trim();
    if (!/^\d+$/.test(idTrim) || /^0+$/.test(idTrim)) {
      setError("Enter a valid numeric Report ID (e.g. 1).");
      return;
    }

    setLoading(true);
    try {
      const client = getReadonlyClient();
      const report = (await client.readContract({
        address: REGISTRY_ADDRESS,
        abi: registryAbi,
        functionName: "getReport",
        args: [BigInt(idTrim)],
      })) as unknown as OnChainReport;

      setResult(report);

      // Optional hash comparison: manual input or a local submission record.
      const local = findSubmissionByReportId(idTrim);
      const candidate = compareHash.trim() || local?.reportHash;
      if (candidate) {
        setHashMatch(
          candidate.toLowerCase() === report.reportHash.toLowerCase()
            ? "match"
            : "mismatch"
        );
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      if (/ReportNotFound/i.test(message)) {
        setError("Report not found. No report exists for that ID.");
      } else {
        setError(
          "Could not read the report from the contract. Please check the ID and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer className="py-10">
      <PageHeading
        eyebrow="Report Verification"
        icon={ShieldCheck}
        title="Verify a"
        highlight="Report"
        subtitle="Publicly verify a report commitment stored on HashKey Chain. No wallet connection required."
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: form */}
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="font-semibold text-white">Verify Report</h2>
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Enter a Report ID to read its on-chain commitment from the registry.
          </p>

          {!isRegistryConfigured() && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-risk-medium/40 bg-risk-medium/10 p-3 text-sm text-risk-medium">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Registry contract address is not configured.</span>
            </div>
          )}

          <div className="mt-5 space-y-4">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-white">
                Report ID <Info className="h-3.5 w-3.5 text-slate-500" />
              </label>
              <Input
                className="mt-2"
                placeholder="e.g., 1"
                inputMode="numeric"
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-white">
                Report Hash to compare{" "}
                <span className="text-slate-500">(optional)</span>
              </label>
              <div className="relative mt-2">
                <Input
                  placeholder="0x… (leave empty to auto-use a local record)"
                  className="pr-24 font-mono"
                  value={compareHash}
                  onChange={(e) => setCompareHash(e.target.value)}
                />
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setCompareHash((await navigator.clipboard.readText()).trim());
                    } catch {
                      /* ignore */
                    }
                  }}
                  className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
                >
                  <Clipboard className="h-3.5 w-3.5" /> Paste
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-risk-high/40 bg-risk-high/10 p-3 text-sm text-risk-high">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Verifying…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" /> Verify Now
                </>
              )}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
              <ShieldCheck className="h-3 w-3" /> Read-only, public verification
              via the HashKey Chain RPC.
            </p>
          </div>
        </Card>

        {/* Right: result */}
        <div className="space-y-6">
          {!result ? (
            <Card className="flex min-h-[200px] flex-col items-center justify-center p-6 text-center">
              <FileCode2 className="h-8 w-8 text-slate-600" />
              <p className="mt-3 text-sm text-slate-400">
                Enter a Report ID and click Verify to read its on-chain record.
              </p>
            </Card>
          ) : (
            <>
              <Card className="border-risk-low/30 bg-risk-low/5 p-6">
                <div className="text-xs text-slate-400">Verification Result</div>
                <div className="mt-2 flex items-center gap-3">
                  <CheckCircle2 className="h-10 w-10 text-risk-low" />
                  <div>
                    <div className="text-2xl font-bold text-risk-low">
                      Report Found
                    </div>
                    <p className="text-sm text-slate-400">
                      This report commitment exists on-chain in the registry.
                    </p>
                  </div>
                </div>

                <dl className="mt-5 divide-y divide-border">
                  <ResultRow icon={User} label="Reporter" value={result.reporter} mono />
                  <ResultRow icon={Target} label="Target" value={result.target} mono />
                  <div className="flex items-center justify-between py-3">
                    <dt className="flex items-center gap-2 text-sm text-slate-400">
                      <Gauge className="h-4 w-4 text-slate-500" /> Risk Score
                    </dt>
                    <dd>
                      <Badge tone="neutral">{result.score} / 100</Badge>
                    </dd>
                  </div>
                  <ResultRow
                    icon={Hash}
                    label="Report Hash"
                    value={result.reportHash}
                    mono
                  />
                  <ResultRow
                    icon={FileCode2}
                    label="Metadata URI"
                    value={result.metadataURI}
                    mono
                  />
                  <ResultRow
                    icon={Clock}
                    label="Timestamp"
                    value={formatTimestamp(result.timestamp)}
                  />
                </dl>

                {REGISTRY_ADDRESS && (
                  <a
                    href={explorerAddressUrl(REGISTRY_ADDRESS)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-1.5 text-xs text-brand-200 hover:text-brand-100"
                  >
                    View registry on Explorer <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </Card>

              {/* Hash comparison */}
              {hashMatch !== "none" && (
                <Card className="p-6">
                  <div className="flex items-center gap-2">
                    <GitCompare className="h-5 w-5 text-blue-600" />
                    <h2 className="font-semibold text-white">Hash Comparison</h2>
                  </div>
                  {hashMatch === "match" ? (
                    <div className="mt-3 flex items-center gap-2 text-sm text-risk-low">
                      <CheckCircle2 className="h-4 w-4" /> Computed/known hash
                      matches the on-chain hash. The report is authentic.
                    </div>
                  ) : (
                    <div className="mt-3 flex items-center gap-2 text-sm text-risk-high">
                      <XCircle className="h-4 w-4" /> Hash mismatch — the provided
                      hash does not match the on-chain record.
                    </div>
                  )}
                </Card>
              )}
            </>
          )}

          <Card className="p-5">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-white">
                  What does verification check?
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  It reads the immutable report commitment (reporter, target,
                  score, report hash, metadata URI, timestamp) directly from the
                  GuardFiReportRegistry contract. Optionally, it compares a known
                  report hash against the on-chain hash.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function ResultRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <dt className="flex items-center gap-2 text-sm text-slate-400">
        <Icon className="h-4 w-4 text-slate-500" /> {label}
      </dt>
      <dd
        className={`truncate text-sm text-slate-700 ${mono ? "font-mono text-xs" : ""}`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}
