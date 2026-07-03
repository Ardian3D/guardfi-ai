import * as React from "react";
import { Copy } from "lucide-react";
import { Card } from "@/components/docs/DocCard";
import { Badge } from "@/components/docs/DocBadge";
import { DocHeader } from "@/components/docs/DocShared";

const API_CODE = `curl -X POST https://api.guardfi.ai/v1/scan \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contractAddress": "0x8f3a...7bC9d2",
    "chainId": 133
  }'`;

const API_RESPONSE = `{
  "success": true,
  "scanId": "scan_01J2KQ9Z6V7YQW5E8R1T2A3D",
  "status": "completed",
  "riskScore": 72,
  "reportHash": "QmY8U2x7...9nL3kP1v",
  "contractAddress": "0x8f3a...7bC9d2"
}`;

export default function ApiPage() {
  return (
    <>
      <DocHeader
        eyebrow="05 — API Reference"
        title="Integrate with GuardFi AI"
        description="Use the REST API to scan contracts, retrieve reports, and verify results programmatically."
      />

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-sm text-slate-500">
            Use the REST API to scan contracts, retrieve reports, and verify
            results programmatically.
          </p>
          <div className="shrink-0">
            <div className="text-xs text-slate-400">Base URL</div>
            <div className="mt-1 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-600">
              https://api.guardfi.ai/v1
              <Copy className="h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            POST /scan
          </span>
          <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500">
            GET /reports/:id
          </span>
          <span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500">
            POST /verify
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs">
              <span className="text-slate-600">Request</span>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <pre className="overflow-x-auto bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
              {API_CODE}
            </pre>
          </div>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-xs">
              <span className="text-slate-600">Response</span>
              <Badge tone="low">200 OK</Badge>
            </div>
            <pre className="overflow-x-auto bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
              {API_RESPONSE}
            </pre>
          </div>
        </div>
      </Card>
    </>
  );
}
