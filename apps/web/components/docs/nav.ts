import {
  FileText,
  Gauge,
  Link2,
  Coins,
  Code2,
  FileCode2,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";

export type DocNavItem = {
  icon: LucideIcon;
  label: string;
  href: string;
  /** Short label shown as the eyebrow on each page. */
  eyebrow: string;
};

/**
 * Single source of truth for the docs navigation.
 * The sidebar, the prev/next pager, and each page's header all read from this,
 * so ordering and labels stay in sync automatically.
 */
export const DOCS_NAV: DocNavItem[] = [
  { icon: FileText, label: "Overview", href: "/docs", eyebrow: "01 — Overview" },
  {
    icon: Gauge,
    label: "Risk Scoring",
    href: "/docs/risk-scoring",
    eyebrow: "02 — Risk Scoring",
  },
  {
    icon: Link2,
    label: "On-Chain Proof",
    href: "/docs/on-chain",
    eyebrow: "03 — On-Chain Proof",
  },
  {
    icon: Coins,
    label: "HSP Premium Unlock",
    href: "/docs/hsp",
    eyebrow: "04 — HSP Premium Unlock",
  },
  {
    icon: Code2,
    label: "API Reference",
    href: "/docs/api",
    eyebrow: "05 — API Reference",
  },
  {
    icon: FileCode2,
    label: "Smart Contract",
    href: "/docs/contract",
    eyebrow: "06 — Smart Contract",
  },
  {
    icon: AlertTriangle,
    label: "Disclaimer",
    href: "/docs/disclaimer",
    eyebrow: "07 — Disclaimer",
  },
];
