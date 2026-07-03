# GuardFi AI

**AI-powered DeFi Risk Guardian on HashKey Chain.**

GuardFi AI helps users understand the risk of a smart contract **before** they interact with it. It scans a contract on HashKey Chain, runs a deterministic risk engine, generates a structured AI report, and anchors a tamper-evident **report commitment** on-chain that anyone can publicly verify.

> **Disclaimer:** GuardFi AI is **automated risk intelligence — not a formal audit and not financial advice.** Selector detection is best-effort and may produce false positives or false negatives. Always do your own research. GuardFi AI does **not** have a token.

---

## Problem

Interacting with an unknown DeFi contract means trusting code you can't read. The most damaging risks are invisible to most users until it's too late: hidden owner privileges, unlimited minting, blacklist/pause controls, upgradeable proxies, and unverified source code. Formal audits are slow and expensive, and even when a "report" exists, users have no easy way to verify it hasn't been tampered with.

## Solution

GuardFi AI turns contract risk into **verifiable intelligence**:

1. **Scan** — read the contract's on-chain bytecode and metadata.
2. **Score** — a deterministic rule engine produces a 0–100 risk score with machine- and human-readable indicators.
3. **Explain** — an AI report (DeepSeek) explains the deterministic findings in plain language, with a deterministic fallback when AI is unavailable.
4. **Prove** — the user's own wallet anchors a minimal report commitment (hash + metadata) in the `GuardFiReportRegistry` contract on HashKey Chain.
5. **Verify** — anyone can publicly look up a report by ID and confirm it exists on-chain, with no wallet required.

## Key features

- Real wallet connection (wagmi + viem + RainbowKit) on HashKey Chain mainnet (chainId 177).
- Deterministic, inspectable risk engine (reproducible score + versioned ruleset).
- Best-effort on-chain analysis: bytecode presence, ERC-20 metadata, EIP-1967 proxy signal, 4-byte selector scan.
- AI report generator via **DeepSeek** with a **deterministic fallback** (never crashes without an API key).
- `keccak256` report hashing and **wallet-signed** on-chain `submitReport()`.
- Public, wallet-free report verification page.
- Wallet-based dashboard aggregating local scan/report/proof/unlock activity.
- HSP premium unlock via an **adapter** (mock adapter for demo; real adapter is a documented skeleton).

## Why HashKey Chain

The `GuardFiReportRegistry` contract is deployed on **HashKey Chain mainnet**, so report commitments live on a real, EVM-compatible chain with a public explorer (Blockscout). This makes every report independently and permanently verifiable, and keeps GuardFi AI aligned with the HashKey ecosystem it analyzes.

## How AI is used

The AI (DeepSeek) is given **only** the deterministic scan result and is instructed to explain it — never to invent vulnerabilities, token data, audit status, liquidity, holders, exploit history, or financial advice. Output is strict JSON, validated and sanitized (forbidden claims like "guaranteed safe" / "formal audit" are stripped). If `DEEPSEEK_API_KEY` is not set or the call fails, GuardFi AI produces a **deterministic fallback report** from the same indicators, so the feature always works.

## How on-chain proof works

The full report stays **off-chain**. Only a minimal commitment is stored on-chain via `submitReport(target, score, reportHash, metadataURI)`:

- `reportHash` = `keccak256` of a **deterministic** report payload (stable, sorted JSON).
- `metadataURI` = a reference to the off-chain report.
- `reporter` = the connected wallet (`msg.sender`), which signs the transaction.

The backend never submits transactions. Anyone can call `getReport(reportId)` to read the commitment and verify integrity.

## How HSP is used

The full AI report is a **premium product** unlocked with **HSP**. Payment is handled behind an `HspAdapter` interface so the provider can be swapped without touching the app. A **mock adapter** (clearly labeled "Mock HSP Mode") powers the demo; a **real adapter skeleton** is included and, until configured, reports "HSP adapter is not configured." Payment **does not** change the on-chain report hash — the registry remains a public proof layer.

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| Wallet | wagmi, viem, RainbowKit |
| AI | DeepSeek (`deepseek-v4-flash`) + deterministic fallback |
| Contract | Solidity 0.8.24, Hardhat, ethers v6 |
| Chain | HashKey Chain mainnet (chainId 177) |
| Tests | Vitest (frontend), Hardhat/Mocha/Chai (contract) |

## Architecture overview

```
apps/
├─ web/         Next.js frontend + risk engine + AI report + HSP adapter (all client/serverless)
│  ├─ app/            routes + API routes (/api/scans, /api/reports/generate)
│  ├─ lib/risk-engine scanner (viem), rules, scoring
│  ├─ lib/reports     serialize + keccak256 hashing + submission storage
│  ├─ lib/ai-report   DeepSeek adapter + fallback + parser
│  ├─ lib/hsp         adapter interface + mock + real skeleton
│  ├─ lib/dashboard   storage readers + pure aggregator
│  └─ lib/contracts   ABI + registry client
└─ contracts/  Hardhat workspace: GuardFiReportRegistry.sol
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for full flow diagrams.

## Live deployment

| Item | Value |
|---|---|
| Registry contract | `0xBa0422Df609cA9f0E6157Da62075aa12316801Ea` |
| Example transaction | `0x33fb6c21f30f2d492085e10ae6a8277327e57f59d019408c307dffd88828a1fb` |
| Explorer | https://hashkey.blockscout.com |
| Example verify Report ID | `1` |

## Demo flow

1. Open the landing page → **Launch App**.
2. **Connect wallet** and switch to HashKey Chain.
3. Land on the **Dashboard**.
4. **New Scan** → analyze a target contract (or the Sample Target demo).
5. On the result page, **Generate AI Report**.
6. **Unlock Premium Report** (HSP mock mode) → view the full report.
7. **Save Proof On-Chain** → sign the transaction.
8. Open the transaction on **HashKey Blockscout**.
9. Go to **/verify**, enter the Report ID → read the on-chain commitment.
10. Return to the **Dashboard** to see the activity.

Full script: [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md).

## Local setup

Prerequisites: Node.js 18+ and npm. A browser wallet (e.g. MetaMask) for the app.

### Frontend (`apps/web`)

```bash
cd apps/web
npm install
cp .env.example .env.local   # fill values (see docs/ENVIRONMENT.md)
npm run dev                  # http://localhost:3000
```

### Contracts (`apps/contracts`)

```bash
cd apps/contracts
npm install
cp .env.example .env         # fill PRIVATE_KEY_DEPLOYER, RPC
npm run compile
npm test
```

## Environment variables

See [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) for the full reference. Quick note:

- **Never commit `.env` / `.env.local`.**
- `DEEPSEEK_API_KEY`, `HSP_API_KEY`, `PRIVATE_KEY_DEPLOYER` are **server/secret** — never prefix with `NEXT_PUBLIC_`.
- With no `DEEPSEEK_API_KEY` the AI report falls back deterministically. Set `NEXT_PUBLIC_HSP_MODE=mock` for the demo unlock flow.

## Commands

**Frontend (`apps/web`):**

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm test` | Run Vitest unit tests |

**Contracts (`apps/contracts`):**

| Command | Description |
|---|---|
| `npm run compile` | Compile the contract |
| `npm test` | Run contract tests |
| `npm run deploy:hashkey` | Deploy to HashKey Chain (manual) |

## Testing

- Frontend: `cd apps/web && npm test` — Vitest covers the risk engine, AI report (fallback/parser/sanitizer), HSP (mock adapter/storage/config/service), and dashboard aggregation.
- Contracts: `cd apps/contracts && npm test` — Hardhat covers `submitReport`, `getReport`, indexing, and validation reverts.
- Full manual checklist: [`docs/TESTING_CHECKLIST.md`](docs/TESTING_CHECKLIST.md).

## Deployment notes

- The registry is deployed manually with `npm run deploy:hashkey`; nothing deploys automatically. The deployer wallet must hold **HSK** for gas.
- After deploy, set `NEXT_PUBLIC_REGISTRY_ADDRESS` in the frontend. See [`apps/contracts/docs/contract-deployment.md`](apps/contracts/docs/contract-deployment.md).
- If write/estimate RPC calls return 403 on `https://mainnet.hsk.xyz`, use the managed RPC `https://hashkeychain-mainnet.alt.technology`.

## Security & disclaimer

- GuardFi AI is **automated risk intelligence, not a formal audit and not financial advice.**
- Detection is best-effort; absence of a signal does **not** guarantee safety.
- MVP data (scan results, AI reports, unlock state) is stored in the browser (`localStorage`/`sessionStorage`). Production must verify payment/access server-side and persist data properly.
- The full report stays off-chain; only a minimal commitment is on-chain.
- GuardFi AI has **no token**.

## Hackathon relevance

GuardFi AI targets the **DeFi + AI** intersection on HashKey Chain: a real mainnet smart contract for verifiable proofs, AI used responsibly (explaining deterministic findings, not fabricating them), and HSP as the premium-access settlement layer. See [`docs/SUBMISSION.md`](docs/SUBMISSION.md) and [`docs/PITCH.md`](docs/PITCH.md).
