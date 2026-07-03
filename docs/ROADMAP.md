# GuardFi AI — Roadmap

## MVP — completed
- Wallet connect (wagmi/viem/RainbowKit) + HashKey Chain switching.
- Risk scan engine: bytecode presence, ERC-20 metadata, EIP-1967 proxy signal, best-effort selector detection.
- Deterministic risk score + indicators (versioned ruleset).
- AI report generator (DeepSeek) with deterministic fallback.
- Deterministic report hashing (keccak256 of stable payload).
- On-chain proof: wallet-signed `submitReport()` to `GuardFiReportRegistry` (deployed on HashKey Chain).
- Public verification page (`getReport`, read-only, no wallet).
- Wallet-based dashboard from local activity.
- HSP premium unlock — mock adapter + real adapter skeleton.
- Frontend unit tests + contract tests; production build passing.

## Near-term
- **Real HSP adapter** — wire the official HSP flow behind the existing `HspAdapter` interface (server route for secrets, real settlement verification).
- **Database** — persist scans/reports/submissions/unlocks server-side (replace browser storage); verify premium access server-side.
- **IPFS metadata** — publish the full off-chain report to IPFS and use a real CID for `metadataURI`.
- **Blockscout source-verification lookup** — resolve `sourceVerified` instead of `unknown`.
- **Contract verification automation** — verify `GuardFiReportRegistry` on Blockscout during deploy.
- **More risk rules** — expand detectors (roles, fee-on-transfer patterns, honeypot heuristics) with confidence scoring.

## Long-term
- **Protocol monitoring** — continuous re-scans of watched contracts.
- **Alerts** — notify on owner actions, upgrades, or risk-score changes.
- **Team workspace** — shared scan history and reports for teams.
- **Audit partner workflow** — hand off high-risk targets to human auditors; link formal audits to reports.
- **API access** — programmatic scans + a verification widget for dApps.

---

Scope is intentionally conservative: nothing here is claimed as done until it ships. GuardFi AI remains automated risk intelligence — not a formal audit or financial advice — and has no token.
