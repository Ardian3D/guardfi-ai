import {
  createPublicClient,
  http,
  isAddress,
  getAddress,
  toFunctionSelector,
} from "viem";
import { hashKeyChain } from "../chains";
import {
  DEMO_TARGET_ADDRESS,
  EIP1967_IMPLEMENTATION_SLOT,
  RULESET_VERSION,
  SELECTOR_SIGNATURES,
  SUPPORTED_CHAIN_ID,
} from "./constants";
import { buildRiskIndicators } from "./rules";
import { computeScore, mapRiskLevel } from "./scoring";
import type {
  ContractMetadata,
  ScanRequest,
  ScanResult,
  ScanType,
} from "./types";

/** Error codes surfaced to the API with appropriate HTTP status. */
export type ScanErrorCode =
  | "INVALID_ADDRESS"
  | "WRONG_CHAIN"
  | "INVALID_SCAN_TYPE"
  | "NOT_A_CONTRACT"
  | "RPC_ERROR";

export class ScanError extends Error {
  code: ScanErrorCode;
  status: number;
  constructor(code: ScanErrorCode, message: string, status: number) {
    super(message);
    this.name = "ScanError";
    this.code = code;
    this.status = status;
  }
}

/** Minimal ERC-20 ABI for metadata reads. */
const ERC20_ABI = [
  { type: "function", name: "name", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "symbol", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { type: "function", name: "decimals", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
] as const;

/**
 * PURE: best-effort selector scan. Looks for each known 4-byte selector inside
 * the runtime bytecode. This is a heuristic — presence is a signal, not proof;
 * absence does not imply safety.
 */
export function detectSelectorsFromBytecode(bytecode: string): string[] {
  if (!bytecode || bytecode === "0x") return [];
  const code = bytecode.toLowerCase();
  const found: string[] = [];
  for (const signature of SELECTOR_SIGNATURES) {
    const selector = toFunctionSelector(signature).slice(2).toLowerCase();
    if (code.includes(selector)) found.push(signature);
  }
  return found;
}

/** PURE: validate a scan request; throws ScanError on invalid input. */
export function validateScanRequest(input: Partial<ScanRequest>): ScanRequest {
  const { targetAddress, chainId, scanType } = input;

  if (!targetAddress || typeof targetAddress !== "string" || !isAddress(targetAddress)) {
    throw new ScanError(
      "INVALID_ADDRESS",
      "Invalid EVM address. Please enter a valid 0x… contract address.",
      400
    );
  }
  if (chainId !== SUPPORTED_CHAIN_ID) {
    throw new ScanError(
      "WRONG_CHAIN",
      `Unsupported chain. GuardFi AI currently scans HashKey Chain (chainId ${SUPPORTED_CHAIN_ID}) only.`,
      400
    );
  }
  if (scanType !== "TOKEN" && scanType !== "CONTRACT") {
    throw new ScanError(
      "INVALID_SCAN_TYPE",
      "scanType must be 'TOKEN' or 'CONTRACT'.",
      400
    );
  }

  return {
    targetAddress: getAddress(targetAddress),
    chainId,
    scanType,
    walletAddress: input.walletAddress,
  };
}

function newScanId(): string {
  const rand =
    typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID().replace(/-/g, "").slice(0, 16)
      : Math.random().toString(16).slice(2, 18);
  return `scan_${rand}`;
}

const RPC_URL =
  process.env.HASHKEY_RPC_URL ?? hashKeyChain.rpcUrls.default.http[0];

function createClient() {
  return createPublicClient({
    chain: hashKeyChain,
    transport: http(RPC_URL),
  });
}

/** Fetch on-chain metadata (best-effort). Throws ScanError for RPC/NOT_A_CONTRACT. */
export async function fetchContractMetadata(
  request: ScanRequest
): Promise<ContractMetadata> {
  const client = createClient();
  const address = request.targetAddress as `0x${string}`;

  let bytecode: string | undefined;
  try {
    bytecode = await client.getBytecode({ address });
  } catch {
    throw new ScanError(
      "RPC_ERROR",
      "Could not reach the HashKey Chain RPC to read contract bytecode. Please try again.",
      502
    );
  }

  if (!bytecode || bytecode === "0x") {
    throw new ScanError(
      "NOT_A_CONTRACT",
      "This address has no contract bytecode on HashKey Chain. It may be a wallet address or not deployed.",
      422
    );
  }

  const bytecodeSize = (bytecode.length - 2) / 2;
  const detectedSelectors = detectSelectorsFromBytecode(bytecode);

  // ERC-20 metadata (best-effort; failures → unknown).
  const readString = async (fn: "name" | "symbol") => {
    try {
      return (await client.readContract({ address, abi: ERC20_ABI, functionName: fn })) as string;
    } catch {
      return undefined;
    }
  };
  const tokenName = await readString("name");
  const tokenSymbol = await readString("symbol");

  let decimals: number | undefined;
  try {
    decimals = Number(
      await client.readContract({ address, abi: ERC20_ABI, functionName: "decimals" })
    );
  } catch {
    decimals = undefined;
  }

  let totalSupply: string | undefined;
  try {
    const raw = (await client.readContract({
      address,
      abi: ERC20_ABI,
      functionName: "totalSupply",
    })) as bigint;
    totalSupply = raw.toString();
  } catch {
    totalSupply = undefined;
  }

  // EIP-1967 proxy signal (best-effort).
  let proxyDetected: boolean | "unknown";
  try {
    const slot = await client.getStorageAt({
      address,
      slot: EIP1967_IMPLEMENTATION_SLOT,
    });
    proxyDetected =
      !!slot && /[1-9a-f]/.test(slot.slice(2)) // any non-zero nibble
        ? true
        : false;
  } catch {
    proxyDetected = "unknown";
  }

  return {
    targetAddress: address,
    chainId: request.chainId,
    isContract: true,
    bytecodeSize,
    tokenName,
    tokenSymbol,
    decimals,
    totalSupply,
    sourceVerified: "unknown", // no explorer lookup in this phase
    proxyDetected,
    detectedSelectors,
    scanTime: new Date().toISOString(),
  };
}

/** A labeled sample result so the demo never depends on a live contract. */
function buildDemoResult(request: ScanRequest): ScanResult {
  const metadata: ContractMetadata = {
    targetAddress: request.targetAddress,
    chainId: request.chainId,
    isContract: true,
    bytecodeSize: 6234,
    tokenName: "Sample Token",
    tokenSymbol: "SMPL",
    decimals: 18,
    totalSupply: "1000000000000000000000000",
    sourceVerified: "unknown",
    proxyDetected: true,
    detectedSelectors: [
      "owner()",
      "transferOwnership(address)",
      "mint(address,uint256)",
      "pause()",
      "unpause()",
      "blacklist(address)",
      "setFee(uint256)",
      "implementation()",
    ],
    scanTime: new Date().toISOString(),
    demoMode: true,
  };
  return assembleResult(request, metadata);
}

function assembleResult(
  request: ScanRequest,
  metadata: ContractMetadata
): ScanResult {
  const riskIndicators = buildRiskIndicators(metadata, request.scanType);
  const riskScore = computeScore(riskIndicators);
  const riskLevel = mapRiskLevel(riskScore);

  return {
    scanId: newScanId(),
    targetAddress: request.targetAddress,
    chainId: request.chainId,
    scanType: request.scanType,
    status: "COMPLETED",
    metadata,
    riskScore,
    riskLevel,
    riskIndicators,
    aiSummaryPreview:
      "AI-generated explanation is available in the premium report. This preview summarizes deterministic findings only.",
    rulesetVersion: RULESET_VERSION,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Orchestrator: validate → (demo shortcut) → fetch metadata → rules → score.
 * Throws ScanError with a clear code/message on failure.
 */
export async function runScan(input: Partial<ScanRequest>): Promise<ScanResult> {
  const request = validateScanRequest(input);

  if (request.targetAddress.toLowerCase() === DEMO_TARGET_ADDRESS.toLowerCase()) {
    return buildDemoResult(request);
  }

  const metadata = await fetchContractMetadata(request);
  return assembleResult(request, metadata);
}
