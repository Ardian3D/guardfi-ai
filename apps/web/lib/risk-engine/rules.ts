import type { ContractMetadata, RiskIndicator, ScanType } from "./types";
import { SELECTOR_GROUPS } from "./constants";

/**
 * Deterministic rule engine. Turns collected (best-effort) metadata into a
 * list of machine-readable, human-readable risk indicators.
 *
 * IMPORTANT: selector detection is a heuristic. Presence of a selector is a
 * signal, not proof. Absence does NOT imply the contract is safe.
 */
export function buildRiskIndicators(
  metadata: ContractMetadata,
  scanType: ScanType
): RiskIndicator[] {
  const indicators: RiskIndicator[] = [];
  const selectors = metadata.detectedSelectors;
  const matched = (group: readonly string[]) =>
    group.filter((sig) => selectors.includes(sig));

  // NON_CONTRACT_ADDRESS — nothing else is meaningful.
  if (!metadata.isContract) {
    indicators.push({
      code: "NON_CONTRACT_ADDRESS",
      severity: "CRITICAL",
      title: "Address is not a contract",
      description:
        "No runtime bytecode was found at this address on the selected chain. It may be a wallet (EOA) or an undeployed address.",
      evidence: `bytecodeSize=${metadata.bytecodeSize} bytes`,
      confidence: "HIGH",
    });
    return indicators;
  }

  // BYTECODE_AVAILABLE — informational baseline.
  indicators.push({
    code: "BYTECODE_AVAILABLE",
    severity: "LOW",
    title: "Contract bytecode available",
    description:
      "Runtime bytecode was retrieved and analyzed with a best-effort selector scan.",
    evidence: `bytecodeSize=${metadata.bytecodeSize} bytes`,
    confidence: "HIGH",
  });

  const owner = matched(SELECTOR_GROUPS.OWNER);
  if (owner.length) {
    indicators.push({
      code: "OWNER_PRIVILEGE_DETECTED",
      severity: "HIGH",
      title: "Owner privileges detected",
      description:
        "Owner/admin control functions were detected. A privileged owner may change critical parameters.",
      evidence: owner.join(", "),
      confidence: "MEDIUM",
    });
  }

  const mint = matched(SELECTOR_GROUPS.MINT);
  if (mint.length) {
    indicators.push({
      code: "MINT_FUNCTION_DETECTED",
      severity: "HIGH",
      title: "Mint function detected",
      description:
        "A mint function was detected. New tokens may be created, potentially diluting holders.",
      evidence: mint.join(", "),
      confidence: "MEDIUM",
    });
  }

  const blacklist = matched(SELECTOR_GROUPS.BLACKLIST);
  if (blacklist.length) {
    indicators.push({
      code: "BLACKLIST_FUNCTION_DETECTED",
      severity: "CRITICAL",
      title: "Blacklist function detected",
      description:
        "Blacklist/denylist functions were detected. Specific addresses may be blocked from transacting.",
      evidence: blacklist.join(", "),
      confidence: "MEDIUM",
    });
  }

  const pause = matched(SELECTOR_GROUPS.PAUSE);
  if (pause.length) {
    indicators.push({
      code: "PAUSE_FUNCTION_DETECTED",
      severity: "MEDIUM",
      title: "Pause function detected",
      description:
        "Pause/unpause functions were detected. Transfers may be halted by a privileged role.",
      evidence: pause.join(", "),
      confidence: "MEDIUM",
    });
  }

  const tax = matched(SELECTOR_GROUPS.TAX);
  if (tax.length) {
    indicators.push({
      code: "TRANSFER_TAX_SELECTOR_DETECTED",
      severity: "HIGH",
      title: "Transfer tax / fee control detected",
      description:
        "Fee/tax setter functions were detected. Transfer taxes may be changed by the owner.",
      evidence: tax.join(", "),
      confidence: "MEDIUM",
    });
  }

  // PROXY_PATTERN_DETECTED — MEDIUM by selector, HIGH if EIP-1967 slot is set.
  const proxySelectors = matched(SELECTOR_GROUPS.PROXY);
  const proxyBySlot = metadata.proxyDetected === true;
  if (proxyBySlot || proxySelectors.length) {
    indicators.push({
      code: "PROXY_PATTERN_DETECTED",
      severity: proxyBySlot ? "HIGH" : "MEDIUM",
      title: "Proxy / upgradeable pattern detected",
      description:
        "Upgradeable proxy signals were detected. Contract logic may be replaced after deployment.",
      evidence: proxyBySlot
        ? "EIP-1967 implementation slot is set"
        : proxySelectors.join(", "),
      confidence: proxyBySlot ? "HIGH" : "MEDIUM",
    });
  }

  // SOURCE_VERIFICATION_UNKNOWN — cannot confirm from on-chain data alone.
  if (metadata.sourceVerified === "unknown") {
    indicators.push({
      code: "SOURCE_VERIFICATION_UNKNOWN",
      severity: "MEDIUM",
      title: "Source verification unknown",
      description:
        "Source verification status could not be determined from on-chain data alone (no explorer lookup in this phase).",
      evidence: "No verified-source lookup performed",
      confidence: "LOW",
    });
  }

  // TOKEN_METADATA_UNAVAILABLE — LOW for contract scans, MEDIUM for token scans.
  const noTokenMeta =
    metadata.tokenName === undefined && metadata.tokenSymbol === undefined;
  if (noTokenMeta) {
    indicators.push({
      code: "TOKEN_METADATA_UNAVAILABLE",
      severity: scanType === "TOKEN" ? "MEDIUM" : "LOW",
      title: "Token metadata unavailable",
      description:
        "ERC-20 metadata (name/symbol) could not be read. The target may not be a standard token.",
      evidence: "name()/symbol() calls failed or reverted",
      confidence: "MEDIUM",
    });
  }

  return indicators;
}
