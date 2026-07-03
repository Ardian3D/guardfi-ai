import { keccak256, toBytes } from "viem";
import type { ReportPayload } from "./types";
import { stableStringify } from "./serialize";

/**
 * Compute the report hash committed on-chain: keccak256 of the UTF-8 bytes of
 * the deterministic JSON. Returns a 0x-prefixed 32-byte (bytes32) value.
 */
export function computeReportHash(payload: ReportPayload): `0x${string}` {
  const json = stableStringify(payload);
  return keccak256(toBytes(json));
}

/** Hash an already-serialized deterministic string (used for verification). */
export function computeReportHashFromString(json: string): `0x${string}` {
  return keccak256(toBytes(json));
}
