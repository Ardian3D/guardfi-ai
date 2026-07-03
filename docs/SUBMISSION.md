# GuardFi AI — Hackathon Submission

## One-line summary
GuardFi AI is an AI-powered DeFi risk guardian on HashKey Chain: it scans a contract, scores its risk deterministically, explains it with AI, and anchors a verifiable report commitment on-chain.

## Track fit: DeFi + AI
- **DeFi:** pre-transaction risk screening for tokens/contracts, plus an on-chain proof registry.
- **AI:** DeepSeek explains deterministic risk findings in plain language, constrained to avoid hallucination.

## Main innovation
Combining a **deterministic, reproducible risk engine** with an **AI explainer** and a **public on-chain proof layer** — so a risk report is not just generated, it is **verifiable**. The AI never invents data; it only explains what the deterministic engine found, and the report's integrity is provable via an on-chain hash.

## HashKey Chain usage
- `GuardFiReportRegistry` deployed on **HashKey Chain mainnet** (chainId 177).
- Wallet connection + network switching to HashKey Chain (wagmi/viem/RainbowKit).
- Read-only verification via HashKey RPC; explorer links to HashKey Blockscout.

## Smart contract deployed on HashKey Chain
- **Registry:** `0xBa0422Df609cA9f0E6157Da62075aa12316801Ea`
- **Example transaction:** `0x33fb6c21f30f2d492085e10ae6a8277327e57f59d019408c307dffd88828a1fb`
- **Explorer:** https://hashkey.blockscout.com
- **Example verify Report ID:** `1`
- Functions: `submitReport`, `getReport`, `getReportsByTarget`, `getReportsByReporter`. No owner, no token, not upgradeable. User wallet signs submissions.

## AI usage with DeepSeek
- Model: `deepseek-v4-flash` (override via `DEEPSEEK_MODEL`), called **server-side** from `/api/reports/generate`.
- Strict JSON output, validated/sanitized; forbidden claims stripped.
- **Deterministic fallback** when no key or on any failure — the feature never crashes.

## HSP integration approach
- Premium report unlock settled via **HSP**, behind a swappable `HspAdapter` interface.
- **Mock adapter** (labeled "Mock HSP Mode") for the demo; **real adapter skeleton** included.
- Payment does not alter the on-chain report hash; the registry stays a public proof layer.

## What is working now
- Real wallet connect + HashKey Chain switching.
- Live scan: bytecode, ERC-20 metadata, EIP-1967 proxy signal, selector detection.
- Deterministic risk score + indicators (versioned ruleset).
- AI report (DeepSeek) + deterministic fallback.
- keccak256 report hashing.
- Wallet-signed `submitReport()` to the deployed registry.
- Public verification page (`getReport` read-only).
- Wallet-based dashboard from local activity.
- Build passes; 46 frontend unit tests + contract tests pass.

## What is mock / MVP limitation
- **HSP:** mock adapter only; real adapter is a skeleton (throws "not configured").
- **Storage:** scan/report/proof/unlock state is in browser storage (no database).
- **Source verification:** shown as `unknown` (no explorer lookup yet).
- **Selector detection:** best-effort heuristic; not proof.
- Not a formal audit, not financial advice, no token.

## Demo links (fill in for submission)
- Live app: `<add if deployed>`
- Demo video: `<add link>`
- Repo: `<add link>`
- Registry on explorer: https://hashkey.blockscout.com/address/0xBa0422Df609cA9f0E6157Da62075aa12316801Ea
- Example tx: https://hashkey.blockscout.com/tx/0x33fb6c21f30f2d492085e10ae6a8277327e57f59d019408c307dffd88828a1fb

## Team notes
`<team members / roles / contact — fill in>`

---

**Disclaimer:** GuardFi AI is automated risk intelligence, not a formal audit or financial advice. Absence of a signal does not guarantee safety.
