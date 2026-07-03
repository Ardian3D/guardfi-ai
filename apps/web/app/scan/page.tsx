"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import {
  ScanLine,
  Info,
  Clipboard,
  Box,
  Code2,
  FileText,
  Crosshair,
  AlertTriangle,
  ShieldCheck,
  Lock,
  UserCog,
  Coins,
  UserX,
  PauseOctagon,
  Layers,
  Percent,
  Loader2,
} from "lucide-react";
import { PageContainer, PageHeading } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { scanChecks } from "@/lib/mock";
import { SUPPORTED_CHAIN_ID, DEMO_TARGET_ADDRESS } from "@/lib/risk-engine/constants";
import type { ScanType, ScanResult } from "@/lib/risk-engine/types";
import { saveScanResult } from "@/lib/scan-storage";

const CHECK_ICONS = [UserCog, Coins, UserX, PauseOctagon, Layers, Percent, ShieldCheck];

const QUICK_EXAMPLES: { icon: typeof FileText; label: string; address: string }[] = [
  { icon: FileText, label: "Sample Target (demo)", address: DEMO_TARGET_ADDRESS },
  {
    icon: Crosshair,
    label: "Wrapped HSK example",
    address: "0xB210D2120d57b758EE163cFfb43e73728c471Cf1",
  },
  {
    icon: AlertTriangle,
    label: "Zero address (invalid)",
    address: "0x0000000000000000000000000000000000000000",
  },
];

export default function ScanPage() {
  const router = useRouter();
  const { address: walletAddress, isConnected } = useAccount();

  const [target, setTarget] = React.useState("");
  const [scanType, setScanType] = React.useState<ScanType>("TOKEN");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const addressLooksValid = target.trim().length > 0 && isAddress(target.trim());

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      setTarget(text.trim());
      setError(null);
    } catch {
      setError("Could not read from clipboard. Paste the address manually.");
    }
  }

  async function handleAnalyze() {
    setError(null);
    const value = target.trim();

    if (!isAddress(value)) {
      setError("Please enter a valid EVM address (0x… 40 hex characters).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/scans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetAddress: value,
          chainId: SUPPORTED_CHAIN_ID,
          scanType,
          walletAddress: isConnected ? walletAddress : undefined,
        }),
      });

      const data = (await res.json()) as ScanResult | { error?: string };

      if (!res.ok || !("scanId" in data)) {
        const message =
          ("error" in data && data.error) ||
          "Scan failed. Please check the address and try again.";
        setError(message);
        return;
      }

      saveScanResult(data);
      router.push(`/scan/${data.scanId}`);
    } catch {
      setError("Network error. Could not reach the scan service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageContainer className="py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main column */}
        <div className="lg:col-span-2">
          <PageHeading
            eyebrow="Contract Scanner"
            icon={ScanLine}
            title="Scan a"
            highlight="Contract"
            subtitle="Analyze any token or smart contract on HashKey Chain before you interact. Detect risks. Stay protected."
          />

          <Card className="mt-8 p-6">
            {/* Wallet + Network row */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-slate-900">Your Wallet</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {isConnected
                    ? "Connected — scans are attributed to your wallet."
                    : "Connect your wallet to attribute scans (optional for scanning)."}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100/50 px-3 py-2 text-sm text-slate-500">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isConnected ? "bg-risk-low" : "bg-slate-500"
                    }`}
                  />
                  {isConnected && walletAddress
                    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
                    : "Not connected"}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                  Network <Info className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-100/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-slate-500">
                      <Box className="h-4 w-4 text-blue-600" /> HashKey Chain
                    </span>
                    <Badge tone="neutral">chainId {SUPPORTED_CHAIN_ID}</Badge>
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                    <Info className="h-3 w-3" /> Scans read on-chain data from
                    HashKey Chain mainnet.
                  </p>
                </div>
              </div>
            </div>

            {/* Address input */}
            <div className="mt-6">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                Target Contract Address{" "}
                <Info className="h-3.5 w-3.5 text-slate-500" />
              </label>
              <div className="relative mt-2">
                <Input
                  value={target}
                  onChange={(e) => {
                    setTarget(e.target.value);
                    setError(null);
                  }}
                  placeholder="0x…"
                  className="pr-24 font-mono"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={handlePaste}
                  className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100"
                >
                  <Clipboard className="h-3.5 w-3.5" /> Paste
                </button>
              </div>
              {target.trim().length > 0 && !addressLooksValid && (
                <p className="mt-2 text-xs text-risk-high">
                  That doesn&apos;t look like a valid EVM address.
                </p>
              )}
            </div>

            {/* Scan type */}
            <div className="mt-6">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                Scan Type <Info className="h-3.5 w-3.5 text-slate-500" />
              </label>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ScanTypeOption
                  active={scanType === "TOKEN"}
                  onClick={() => setScanType("TOKEN")}
                  icon={Box}
                  title="Token Scan"
                  desc="Analyze token risk (ERC-20 / HRC-20)"
                />
                <ScanTypeOption
                  active={scanType === "CONTRACT"}
                  onClick={() => setScanType("CONTRACT")}
                  icon={Code2}
                  title="Contract Scan"
                  desc="Analyze a general smart contract"
                />
              </div>
            </div>

            {/* Quick examples */}
            <div className="mt-6">
              <label className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                Quick Examples <Info className="h-3.5 w-3.5 text-slate-500" />
              </label>
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {QUICK_EXAMPLES.map((q) => (
                  <button
                    key={q.label}
                    type="button"
                    onClick={() => {
                      setTarget(q.address);
                      setError(null);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100/50 px-4 py-3 text-sm text-slate-500 hover:bg-slate-100"
                  >
                    <q.icon className="h-4 w-4 text-slate-400" /> {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-risk-high/40 bg-risk-high/10 p-3 text-sm text-risk-high">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Analyze */}
            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={handleAnalyze}
              disabled={loading || !addressLooksValid}
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Analyzing…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-5 w-5" /> Analyze Risk
                </>
              )}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-slate-500">
              <Lock className="h-3 w-3" /> We do not execute transactions.
              Read-only analysis for your safety.
            </p>
          </Card>
        </div>

        {/* Sidebar: what this scan checks */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">What This Scan Checks</h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Our deterministic engine performs a best-effort analysis of the
              target contract and highlights potential risks.
            </p>
            <div className="mt-4 space-y-3">
              {scanChecks.map((c, i) => {
                const Icon = CHECK_ICONS[i] ?? ShieldCheck;
                return (
                  <div
                    key={c.title}
                    className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-100/40 p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Icon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {c.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {c.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-5">
            <p className="flex items-start gap-2 text-xs text-slate-400">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
              Detection is best-effort and not a formal audit. Absence of a
              signal does not guarantee safety. Never invest more than you can
              afford to lose.
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function ScanTypeOption({
  active,
  onClick,
  icon: Icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Box;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-between rounded-xl border p-4 text-left transition-colors ${
        active
          ? "border-blue-300/50 bg-blue-500/10"
          : "border-slate-200 hover:bg-slate-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${active ? "text-blue-600" : "text-slate-400"}`} />
        <div>
          <div className="text-sm font-medium text-slate-900">{title}</div>
          <div className="text-xs text-slate-400">{desc}</div>
        </div>
      </div>
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border ${
          active ? "border-brand-400" : "border-slate-200"
        }`}
      >
        {active && <span className="h-2 w-2 rounded-full bg-blue-500" />}
      </span>
    </button>
  );
}
