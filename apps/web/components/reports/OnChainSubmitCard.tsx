"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEventLogs } from "viem";
import {
  Anchor,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { ScanResult } from "@/lib/risk-engine/types";
import { REQUIRED_CHAIN_ID } from "@/lib/chains";
import {
  REGISTRY_ADDRESS,
  isRegistryConfigured,
  registryAbi,
  explorerTxUrl,
  explorerAddressUrl,
} from "@/lib/contracts/registry";
import { buildReportPayload } from "@/lib/reports/serialize";
import { computeReportHash } from "@/lib/reports/hash";
import { buildMetadataURI } from "@/lib/reports/metadata";
import { saveSubmission, getSubmission } from "@/lib/reports/storage";
import type { ReportSubmission } from "@/lib/reports/types";

function friendlyError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/user rejected|user denied|rejected the request/i.test(message)) {
    return "Transaction was rejected in your wallet.";
  }
  if (/insufficient funds/i.test(message)) {
    return "Insufficient HSK to pay for gas.";
  }
  // viem often exposes a concise shortMessage
  const shortMessage = (error as { shortMessage?: string })?.shortMessage;
  return shortMessage || "Transaction failed. Please try again.";
}

export function OnChainSubmitCard({ scan }: { scan: ScanResult }) {
  const router = useRouter();
  const { isConnected, chainId } = useAccount();
  const {
    writeContract,
    data: txHash,
    isPending: isSigning,
    error: writeError,
    reset,
  } = useWriteContract();
  const {
    data: receipt,
    isLoading: isConfirming,
    isSuccess,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const [submission, setSubmission] = React.useState<ReportSubmission | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    setSubmission(getSubmission(scan.scanId));
  }, [scan.scanId]);

  // Deterministic payload/hash/uri for this scan.
  const { reportHash, metadataURI } = React.useMemo(() => {
    const payload = buildReportPayload(scan);
    return {
      reportHash: computeReportHash(payload),
      metadataURI: buildMetadataURI(scan.scanId),
    };
  }, [scan]);

  const onCorrectNetwork = isConnected && chainId === REQUIRED_CHAIN_ID;

  // Persist submission once the receipt confirms.
  React.useEffect(() => {
    if (!isSuccess || !receipt || !REGISTRY_ADDRESS) return;
    let reportId: string | undefined;
    try {
      const logs = parseEventLogs({
        abi: registryAbi,
        eventName: "ReportSubmitted",
        logs: receipt.logs,
      });
      const args = logs[0]?.args as { reportId?: bigint } | undefined;
      if (args?.reportId !== undefined) reportId = args.reportId.toString();
    } catch {
      /* event decode is best-effort; txHash is still shown */
    }

    const record: ReportSubmission = {
      scanId: scan.scanId,
      target: scan.targetAddress,
      score: scan.riskScore,
      reportHash,
      metadataURI,
      status: "SUBMITTED",
      registryAddress: REGISTRY_ADDRESS,
      txHash: receipt.transactionHash,
      reportId,
      submittedAt: new Date().toISOString(),
    };
    saveSubmission(record);
    setSubmission(record);
  }, [isSuccess, receipt, reportHash, metadataURI, scan]);

  function handleSubmit() {
    if (!REGISTRY_ADDRESS) return;
    reset();
    writeContract({
      address: REGISTRY_ADDRESS,
      abi: registryAbi,
      functionName: "submitReport",
      args: [
        scan.targetAddress as `0x${string}`,
        scan.riskScore,
        reportHash,
        metadataURI,
      ],
    });
  }

  const errorMessage = writeError
    ? friendlyError(writeError)
    : receiptError
      ? friendlyError(receiptError)
      : null;

  // ---- Render states ----

  // Registry not configured
  if (!isRegistryConfigured()) {
    return (
      <Card className="p-6">
        <SectionTitle />
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>Registry contract address is not configured.</span>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Set <code className="font-mono">NEXT_PUBLIC_REGISTRY_ADDRESS</code> to
          the deployed GuardFiReportRegistry address to enable on-chain proof.
        </p>
      </Card>
    );
  }

  const alreadySubmitted = mounted && submission?.status === "SUBMITTED";

  return (
    <Card className="p-6">
      <SectionTitle />

      {/* Hash preview */}
      <dl className="mt-4 space-y-2 text-xs">
        <KV label="Report Hash" value={reportHash} mono />
        <KV label="Metadata URI" value={metadataURI} mono />
        <KV label="Target" value={scan.targetAddress} mono />
        <KV label="Score" value={`${scan.riskScore} / 100`} />
      </dl>

      {/* Success */}
      {alreadySubmitted ? (
        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            <span>Submitted on-chain</span>
            {submission?.reportId && (
              <Badge tone="low" className="ml-auto">
                Report #{submission.reportId}
              </Badge>
            )}
          </div>
          {submission?.txHash && (
            <a
              href={explorerTxUrl(submission.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-blue-600 hover:bg-slate-100"
            >
              View transaction on Explorer <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      ) : !onCorrectNetwork ? (
        <div className="mt-5">
          <Button
            size="lg"
            variant="secondary"
            className="w-full"
            onClick={() =>
              router.push(`/connect?redirect=/scan/${scan.scanId}`)
            }
          >
            <Wallet className="h-4 w-4" />
            {isConnected ? "Switch to HashKey Chain" : "Connect wallet to submit"}
          </Button>
          <p className="mt-2 text-center text-xs text-slate-500">
            {isConnected
              ? "Wrong network. HashKey Chain (177) is required."
              : "A connected wallet on HashKey Chain is required to submit."}
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit}
            disabled={isSigning || isConfirming}
          >
            {isSigning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Confirm in wallet…
              </>
            ) : isConfirming ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Waiting for
                confirmation…
              </>
            ) : (
              <>
                <Anchor className="h-4 w-4" /> Save Proof On-Chain
              </>
            )}
          </Button>
          <p className="mt-2 text-center text-xs text-slate-500">
            Your wallet signs the transaction. GuardFi AI never submits for you.
          </p>
        </div>
      )}

      {errorMessage && !alreadySubmitted && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {REGISTRY_ADDRESS && (
        <a
          href={explorerAddressUrl(REGISTRY_ADDRESS)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-600"
        >
          Registry contract <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </Card>
  );
}

function SectionTitle() {
  return (
    <div className="flex items-center gap-2">
      <Anchor className="h-5 w-5 text-blue-600" />
      <h2 className="font-display font-bold text-slate-900">Save Proof On-Chain</h2>
    </div>
  );
}

function KV({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={`truncate text-slate-700 ${mono ? "font-mono text-[11px]" : ""}`}
        title={value}
      >
        {value}
      </dd>
    </div>
  );
}
