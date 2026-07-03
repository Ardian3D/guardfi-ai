import type { Severity } from "./types";

/** Bump when rule logic or weights change, so scores stay reproducible. */
export const RULESET_VERSION = "0.1.0";

/** The only chain the scanner supports for now (HashKey Chain mainnet). */
export const SUPPORTED_CHAIN_ID = 177;

/**
 * EIP-1967 implementation storage slot:
 * bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1)
 */
export const EIP1967_IMPLEMENTATION_SLOT =
  "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc" as const;

/**
 * A valid-format sample address used by the "Sample Target" chip.
 * It triggers a labeled demo result instead of a live RPC read, so the demo
 * never depends on a specific live contract. This is NOT a GuardFi token.
 */
export const DEMO_TARGET_ADDRESS =
  "0x1111111111111111111111111111111111111111" as const;

/** Score contribution per indicator severity (task §6). */
export const SEVERITY_WEIGHTS: Record<Severity, number> = {
  CRITICAL: 25,
  HIGH: 15,
  MEDIUM: 8,
  LOW: 3,
};

/**
 * Function signatures probed via best-effort bytecode selector scanning.
 * Presence of a selector is a *signal*, not proof, of a capability.
 */
export const SELECTOR_SIGNATURES = [
  "owner()",
  "transferOwnership(address)",
  "mint(address,uint256)",
  "pause()",
  "unpause()",
  "blacklist(address)",
  "isBlacklisted(address)",
  "setBlacklist(address,bool)",
  "setTaxFeePercent(uint256)",
  "setFee(uint256)",
  "upgradeTo(address)",
  "upgradeToAndCall(address,bytes)",
  "implementation()",
] as const;

/** Selector groupings used by the rule engine. */
export const SELECTOR_GROUPS = {
  OWNER: ["owner()", "transferOwnership(address)"],
  MINT: ["mint(address,uint256)"],
  BLACKLIST: ["blacklist(address)", "isBlacklisted(address)", "setBlacklist(address,bool)"],
  PAUSE: ["pause()", "unpause()"],
  TAX: ["setTaxFeePercent(uint256)", "setFee(uint256)"],
  PROXY: ["upgradeTo(address)", "upgradeToAndCall(address,bytes)", "implementation()"],
} as const;
