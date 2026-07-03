"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  ClipboardList,
  CheckCircle2,
  ExternalLink,
  Clock,
  MinusCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getScanResult } from "@/lib/scan-storage";
import { getSubmission } from "@/lib/reports/storage";
import { buildReportPayload } from "@/lib/reports/serialize";
import { computeReportHash } from "@/lib/reports/hash";
import { buildMetadataURI } from "@/lib/reports/metadata";
import {
  explorerTxUrl,
  explorerAddressUrl,
  REGISTRY_ADDRESS,
} from "@/lib/contracts/registry";
import type { ReportSubmission, SubmissionStatus } from "@/lib/reports/types";

/**
 * On-chain proof panel for /reports/[id]. Reads any local submission/scan
 * keyed by the route id (a scanId) and shows real reportHash / metadataURI /
 * txHash / reportId / status when available.
 */
export function ReportOnChainStatus() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";

  const [mounted, setMounted] = React.useState(false);
  const [submission, setSubmission] = React.useState<ReportSubmission | null>(null);
  const [derived, setDerived] = React.useState<{
    reportHash: string;
    metadataURI: string;
  } | null>(null);

  React.useEffect(() => {
    setMounted(true);
    const sub = getSubmission(id);
    setSubmission(sub);

    if (!sub) {
      const scan = getScanResult(id);
      if (scan) {
        setDerived({
          reportHash: computeReportHash(buildReportPayload(scan)),
          metadataURI: buildMetadataURI(scan.scanId),
        });
      }
    }
  }, [id]);

  const status: SubmissionStatus = submission?.status ?? "NOT_SUBMITTED";
  const reportHash = submission?.reportHash ?? derived?.reportHash;
  const metadataURI = submission?.metadataURI ?? derived?.metadataURI;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-blue-600" />
        <h3 className="font-display font-bold text-slate-900">On-Chain Proof</h3>
      </div>

      <div className="mt-4">
        <div className="text-xs text-slate-400">Status</div>
        <div className="mt-1">
          {!mounted ? (
            <Badge tone="neutral">Loading…</Badge>
          ) : status === "SUBMITTED" ? (
            <Badge tone="low">
              <CheckCircle2 className="h-3 w-3" /> Submitted On-Chain
            </Badge>
          ) : status === "PENDING" ? (
            <Badge tone="medium">
              <Clock className="h-3 w-3" /> Pending
            </Badge>
          ) : (
            <Badge tone="neutral">
              <MinusCircle className="h-3 w-3" /> Not Submitted
            </Badge>
          )}
        </div>
      </div>

      <Field label="Report Hash" value={reportHash} />
      <Field label="Metadata URI" value={metadataURI} />
      {submission?.reportId && (
        <Field label="Report ID" value={`#${submission.reportId}`} mono={false} />
      )}
      {submission?.txHash && <Field label="Tx Hash" value={submission.txHash} />}

      {submission?.txHash ? (
        <a
          href={explorerTxUrl(submission.txHash)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-blue-600 hover:bg-slate-100"
        >
          View on Explorer <ExternalLink className="h-4 w-4" />
        </a>
      ) : (
        <p className="mt-5 text-xs text-slate-500">
          {mounted && status === "NOT_SUBMITTED"
            ? "No on-chain submission recorded for this report yet. Submit it from the scan result page."
            : ""}
        </p>
      )}

      {REGISTRY_ADDRESS && (
        <a
          href={explorerAddressUrl(REGISTRY_ADDRESS)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-400 hover:text-slate-600"
        >
          Registry contract <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </Card>
  );
}

function Field({
  label,
  value,
  mono = true,
}: {
  label: string;
  value?: string;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="mt-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div
        className={`mt-1 truncate text-xs text-slate-700 ${mono ? "font-mono" : ""}`}
        title={value}
      >
        {value}
      </div>
    </div>
  );
}
