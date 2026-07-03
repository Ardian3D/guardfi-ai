import * as React from "react";
import {
  CheckCircle2,
  Upload,
  ShieldCheck,
  Clock,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ScanStatus =
  | "Report Generated"
  | "On-Chain Submitted"
  | "Verified"
  | "Pending";

const config: Record<
  ScanStatus,
  { icon: React.ElementType; className: string }
> = {
  "Report Generated": { icon: FileText, className: "text-risk-low" },
  "On-Chain Submitted": { icon: Upload, className: "text-blue-600" },
  Verified: { icon: ShieldCheck, className: "text-risk-low" },
  Pending: { icon: Clock, className: "text-risk-medium" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: ScanStatus;
  className?: string;
}) {
  const { icon: Icon, className: tone } = config[status] ?? {
    icon: CheckCircle2,
    className: "text-slate-300",
  };
  return (
    <span
      className={cn("inline-flex items-center gap-2 text-sm", tone, className)}
    >
      <Icon className="h-4 w-4" />
      <span className="text-slate-700">{status}</span>
    </span>
  );
}
