import { createPublicClient, http, isAddress, getAddress } from "viem";
import { hashKeyChain } from "../chains";
import { guardFiReportRegistryAbi } from "./GuardFiReportRegistry.abi";

export const registryAbi = guardFiReportRegistryAbi;

/**
 * GuardFiReportRegistry address from NEXT_PUBLIC_REGISTRY_ADDRESS.
 * `undefined` when unset/invalid so the UI can show a clear warning.
 */
const rawAddress = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS?.trim();
export const REGISTRY_ADDRESS: `0x${string}` | undefined =
  rawAddress && isAddress(rawAddress) ? getAddress(rawAddress) : undefined;

export function isRegistryConfigured(): boolean {
  return REGISTRY_ADDRESS !== undefined;
}

/** Client-side RPC (public). Falls back to the default HashKey RPC. */
const RPC_URL =
  process.env.NEXT_PUBLIC_HASHKEY_RPC_URL ?? hashKeyChain.rpcUrls.default.http[0];

/**
 * Read-only viem public client — used for verification reads that must work
 * even when no wallet/provider is connected.
 */
export function getReadonlyClient() {
  return createPublicClient({
    chain: hashKeyChain,
    transport: http(RPC_URL),
  });
}

export const EXPLORER_BASE = "https://hashkey.blockscout.com";

export function explorerTxUrl(txHash: string): string {
  return `${EXPLORER_BASE}/tx/${txHash}`;
}

export function explorerAddressUrl(address: string): string {
  return `${EXPLORER_BASE}/address/${address}`;
}
