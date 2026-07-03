/**
 * Metadata URI for a report. Phase 5 uses a deterministic placeholder scheme
 * (no real IPFS yet). The URI must be non-empty for submitReport().
 */
export function buildMetadataURI(scanId: string): string {
  return `guardfi://reports/${scanId}`;
}
