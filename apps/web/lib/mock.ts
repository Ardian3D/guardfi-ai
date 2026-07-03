// Centralized mock/static data for GuardFi AI Phase 1.
// NOTE: All values here are sample/demo data only. There is NO GuardFi token.
// The analyzed object is always a "Sample Token" / "Target Contract" for demonstration.

export const SAMPLE_TARGET_ADDRESS = "0x8f3a4d2b9c1e7f6a5b8d3c2e1f4a9bC9d2";
export const SAMPLE_TARGET_SHORT = "0x8f3a...7bC9d2";

export const REGISTRY_CONTRACT_ADDRESS =
  "0x3A7b6B2C7d8e9F1a2B3c4D5e6F7a8B9c0D1e2F3";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical" | "Info";

export interface RiskFinding {
  category: string;
  issue: string;
  severity: RiskLevel;
  description: string;
  evidence?: string;
  recommendation?: string;
}

export const sampleScanResult = {
  scanId: "scan_9f8c7d2b1a3e4f6",
  targetAddress: SAMPLE_TARGET_ADDRESS,
  targetShort: SAMPLE_TARGET_SHORT,
  tokenName: "Sample Token",
  tokenSymbol: "SMP",
  network: "HashKey Chain Testnet",
  verifiedSource: true,
  riskScore: 72,
  riskLevel: "High" as RiskLevel,
  scanTime: "May 27, 2025 10:24 AM (UTC)",
  breakdown: [
    { label: "High Risk", value: 45, color: "high" },
    { label: "Medium Risk", value: 30, color: "medium" },
    { label: "Low Risk", value: 15, color: "low" },
    { label: "Informational", value: 10, color: "info" },
  ],
  aiSummary:
    "GuardFi AI has identified multiple high and medium risk factors in this contract that may pose potential risks to users. The contract includes owner-controlled functions, minting capability, blacklist functionality, and proxy upgrade patterns, which can be misused to modify token behavior or restrict user operations.",
  findings: [
    {
      category: "Owner Privileges",
      issue: "Owner Privileges",
      severity: "High" as RiskLevel,
      description:
        "Owner can perform privileged operations such as blacklisting, pausing, or upgrading.",
    },
    {
      category: "Mint Function",
      issue: "Mint Function",
      severity: "High" as RiskLevel,
      description: "The contract contains mint functions that can create new tokens.",
    },
    {
      category: "Blacklist Function",
      issue: "Blacklist Function",
      severity: "Medium" as RiskLevel,
      description:
        "The contract includes blacklist functionality that can restrict or block user addresses.",
    },
    {
      category: "Proxy Pattern",
      issue: "Proxy Pattern",
      severity: "Medium" as RiskLevel,
      description: "Contract uses proxy pattern which may allow implementation upgrades.",
    },
    {
      category: "Source Verification",
      issue: "Source Verification",
      severity: "Low" as RiskLevel,
      description: "Contract source code is verified and publicly available.",
    },
  ] as RiskFinding[],
};

export const scanChecks = [
  {
    title: "Owner Privileges",
    description: "Checks for privileged owner functions that can modify critical settings.",
  },
  {
    title: "Mint Risk",
    description: "Detects minting functions that can create new tokens.",
  },
  {
    title: "Blacklist Risk",
    description: "Identifies blacklist or denylist functions that can restrict addresses.",
  },
  {
    title: "Pause Risk",
    description: "Checks if the contract can pause or restrict transfers.",
  },
  {
    title: "Proxy Risk",
    description: "Detects upgradeable proxy patterns and implementation changes.",
  },
  {
    title: "Transaction Tax",
    description: "Analyzes buy/sell taxes and hidden fees that impact trades.",
  },
  {
    title: "Verification Status",
    description: "Checks if the contract source code is verified.",
  },
];

export const premiumReport = {
  reportId: "RPT-2025-05-19-000742",
  reportHash: "0x9b7e2c6f3a8d5f1b2c4e7d9a0b3c6e4d8f1a2b3c",
  reportHashShort: "0x9b7e2c6f3a8d5f1b2c4e7d9a0b3c6e...",
  metadataUri: "ipfs://bafybeie7c...k3j5w6q7z9",
  targetAddress: SAMPLE_TARGET_ADDRESS,
  targetShort: SAMPLE_TARGET_SHORT,
  network: "HashKey Chain",
  riskScore: 28,
  riskLevel: "Low" as RiskLevel,
  riskLabel: "Generally safe with minor concerns",
  generatedAt: "May 19, 2025 11:42:08 UTC",
  onChainStatus: "Verified On-Chain",
  scanType: "Full Scan",
  analysisEngine: "GuardFi AI v2.3",
  totals: { total: 12, critical: 0, high: 1, medium: 3, low: 8, info: 0 },
  indicators: [
    {
      category: "Contract Permissions",
      issue: "Owner can update critical parameters",
      severity: "High" as RiskLevel,
      evidence: "setTaxRate(), updateFees()",
      recommendation: "Implement timelock",
    },
    {
      category: "Access Control",
      issue: "Single owner has privileged roles",
      severity: "Medium" as RiskLevel,
      evidence: "onlyOwner modifiers",
      recommendation: "Use multi-sig / timelock",
    },
    {
      category: "Token Behavior",
      issue: "No max transaction limit",
      severity: "Medium" as RiskLevel,
      evidence: "transfer() unrestricted",
      recommendation: "Add optional limits",
    },
    {
      category: "Contract Logic",
      issue: "External calls without reentrancy guard",
      severity: "Low" as RiskLevel,
      evidence: "_stake(), _withdraw()",
      recommendation: "Consider reentrancy guard",
    },
    {
      category: "Liquidity",
      issue: "Low liquidity may increase price impact",
      severity: "Low" as RiskLevel,
      evidence: "Liquidity: $18,420",
      recommendation: "Increase liquidity depth",
    },
  ] as RiskFinding[],
};

export const verificationResult = {
  status: "Verified",
  reporter: "0xA1b2...C3d4e5",
  target: SAMPLE_TARGET_SHORT,
  riskScore: "72 / 100 (High)",
  timestamp: "May 25, 2025 14:32:18 UTC",
  registryContract: "0xRgtR...9e8fA1",
  transactionHash: "0x7b3c...9a8d4e",
  computedHash: "0x3f7b8a1c2d5e6f7890a1b2c3d4e5f67890...abcd",
  onChainHash: "0x3f7b8a1c2d5e6f7890a1b2c3d4e5f67890...abcd",
};

export const dashboardStats = {
  totalScans: 28,
  premiumReports: 11,
  onChainSubmissions: 17,
  verificationCount: 23,
  walletAddress: "0x81a3...7bC9d2",
  connectedOn: "Apr 24, 2025, 09:41 AM",
};

export const riskDistribution = [
  { label: "Critical", value: 5, pct: "18%", color: "critical" },
  { label: "High", value: 8, pct: "29%", color: "high" },
  { label: "Medium", value: 7, pct: "25%", color: "medium" },
  { label: "Low", value: 6, pct: "21%", color: "low" },
  { label: "Unknown", value: 2, pct: "7%", color: "info" },
];

export const recentScans = [
  { target: "0x8f13a...7bC9d2", score: 92, level: "Critical" as RiskLevel, status: "Report Generated", date: "Apr 24, 2025 09:41 AM" },
  { target: "0x4aB2c...1dE7f9", score: 76, level: "High" as RiskLevel, status: "Report Generated", date: "Apr 24, 2025 08:22 AM" },
  { target: "0x9cD4e...a6B8c1", score: 42, level: "Medium" as RiskLevel, status: "On-Chain Submitted", date: "Apr 23, 2025 11:16 PM" },
  { target: "0x7bE8d...2cA9b4", score: 18, level: "Low" as RiskLevel, status: "Verified", date: "Apr 23, 2025 05:09 PM" },
  { target: "0x1aC7f...9eD3b0", score: 67, level: "High" as RiskLevel, status: "Report Generated", date: "Apr 23, 2025 02:45 PM" },
];

export const onChainActivity = [
  { type: "Contract Verified", addr: "0x7bE8d...2cA9b4", network: "HashKey Chain", tx: "0x9a6f...3b2c1e", date: "Apr 23, 2025 05:09 PM" },
  { type: "Report Submitted", addr: "0x9cD4e...a6B8c1", network: "HashKey Chain", tx: "0x5d8e...7a1b3c", date: "Apr 23, 2025 11:16 PM" },
  { type: "Contract Verified", addr: "0x3dF9a...5bC1d7", network: "HashKey Chain", tx: "0x1c3d...9f8e7b", date: "Apr 22, 2025 09:33 PM" },
  { type: "Report Submitted", addr: "0x2bA7c...8dE4f2", network: "HashKey Chain", tx: "0x7b0a...2c9d4e", date: "Apr 22, 2025 03:14 PM" },
];

export const paymentHistory = [
  { date: "Apr 24, 2025 09:41 AM", description: "Premium Report", amount: "20 USDT", status: "Paid" },
  { date: "Apr 23, 2025 02:45 PM", description: "Premium Report", amount: "20 USDT", status: "Paid" },
  { date: "Apr 22, 2025 11:10 AM", description: "On-Chain Submission", amount: "10 USDT", status: "Paid" },
];

export const targetHistory = {
  address: SAMPLE_TARGET_ADDRESS,
  addressShort: SAMPLE_TARGET_SHORT,
  latestScore: 18,
  latestLevel: "Low" as RiskLevel,
  updated: "May 25, 2025 · 12:43 PM UTC",
  network: "HashKey Chain",
  trend: [
    { date: "Apr 28", score: 72 },
    { date: "May 2", score: 55 },
    { date: "May 6", score: 41 },
    { date: "May 10", score: 33 },
    { date: "May 14", score: 27 },
    { date: "May 18", score: 22 },
    { date: "May 22", score: 19 },
    { date: "May 25", score: 18 },
  ],
  insights: [
    { title: "No critical vulnerabilities detected.", text: "The contract does not contain any high-risk vulnerabilities based on our latest analysis." },
    { title: "Ownership is renounced.", text: "The contract owner has renounced ownership, reducing admin risk." },
    { title: "No suspicious external calls.", text: "No risky external calls or blacklisted addresses interacted with." },
    { title: "Contract is verified.", text: "The source code is verified and publicly available on-chain." },
  ],
  reports: [
    { id: "RPT-20250525-1243", score: 18, level: "Low" as RiskLevel, by: "0x7aB3...F9c1", date: "May 25, 2025 · 12:43 PM UTC" },
    { id: "RPT-20250522-0918", score: 19, level: "Low" as RiskLevel, by: "0x91cE...a2D4", date: "May 22, 2025 · 09:18 AM UTC" },
    { id: "RPT-20250518-1532", score: 22, level: "Low" as RiskLevel, by: "0x3dF6...b8A7", date: "May 18, 2025 · 03:32 PM UTC" },
    { id: "RPT-20250514-0811", score: 27, level: "Low" as RiskLevel, by: "0xE11b...9c72", date: "May 14, 2025 · 08:11 AM UTC" },
    { id: "RPT-20250510-2006", score: 33, level: "Low" as RiskLevel, by: "0x7aB3...F9c1", date: "May 10, 2025 · 08:06 PM UTC" },
  ],
  onChainProof: {
    latestReportId: "RPT-20250525-1243",
    storedOnChain: true,
    transactionHash: "0x9c1e...7a3b6d9f2e1c...",
    blockNumber: "15,872,341",
    timestamp: "May 25, 2025 · 12:43 PM UTC",
    dataIntegrity: "Verified",
  },
};

export const hspUnlock = {
  product: "Premium Risk Report",
  productDesc: "Full AI analysis, risk indicators, and on-chain verification.",
  wallet: "0x8f3a7bC9d2E1f4...9aB2c3D4e5F6a7b8",
  network: "HashKey Chain",
  amount: "25 HSP",
  amountUsd: "≈ $12.50 USD",
  benefits: [
    { title: "Full AI Report", desc: "Complete AI-generated analysis and security review." },
    { title: "Full Risk Indicators", desc: "Detailed breakdown of all identified risks and insights." },
    { title: "Downloadable JSON", desc: "Export the full scan data in JSON format." },
    { title: "On-Chain Verification Link", desc: "Verifiable proof of the scan stored on-chain." },
  ],
  successExample: {
    paid: "25 HSP",
    txHash: "0x4a7f...e3b9d1",
    time: "May 16, 2025 10:45 AM",
  },
};
