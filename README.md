<div align="center">

<img src="apps/web/public/guardfi-logo.png" alt="GuardFi AI" width="120" />

# GuardFi AI

### 🛡️ AI-powered DeFi Risk Guardian on HashKey Chain

**Understand the risk of a smart contract — _before_ you interact with it.**

GuardFi AI scans a contract on HashKey Chain, runs a deterministic risk engine, generates a structured AI report, and anchors a tamper-evident **report commitment** on-chain that anyone can publicly verify.

<br/>

[![Chain](https://img.shields.io/badge/HashKey_Chain-mainnet_·_177-6366f1?style=for-the-badge)](https://hashkey.blockscout.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org)
[![AI](https://img.shields.io/badge/AI-DeepSeek-4f46e5?style=for-the-badge)](https://deepseek.com)
[![License](https://img.shields.io/badge/Status-Hackathon_MVP-22c55e?style=for-the-badge)](#)

<br/>

[**🚀 Demo Flow**](#-demo-flow) · [**🧠 How It Works**](#-solution) · [**🏗️ Architecture**](#️-architecture-overview) · [**⚙️ Local Setup**](#️-local-setup) · [**🔗 Live Deployment**](#-live-deployment)

<br/>

<sub>Built by <b>Ardian3D</b> · HashKey Chain Hackathon</sub>

</div>

<br/>

<details>
<summary><b>📑 Table of Contents</b></summary>

- [❗ Problem](#-problem)
- [💡 Solution](#-solution)
- [✨ Key Features](#-key-features)
- [🟣 Why HashKey Chain](#-why-hashkey-chain)
- [🧠 How AI Is Used](#-how-ai-is-used)
- [🔐 How On-Chain Proof Works](#-how-on-chain-proof-works)
- [💎 How HSP Is Used](#-how-hsp-is-used)
- [🧰 Tech Stack](#-tech-stack)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [🔗 Live Deployment](#-live-deployment)
- [🚀 Demo Flow](#-demo-flow)
- [⚙️ Local Setup](#️-local-setup)
- [🔑 Environment Variables](#-environment-variables)
- [🧾 Commands](#-commands)
- [🧪 Testing](#-testing)
- [📦 Deployment Notes](#-deployment-notes)
- [🔒 Security & Disclaimer](#-security--disclaimer)
- [🏆 Hackathon Relevance](#-hackathon-relevance)
- [👤 Author](#-author)

</details>

---

> [!WARNING]
> **Disclaimer:** GuardFi AI is **automated risk intelligence — not a formal audit and not financial advice.** Selector detection is best-effort and may produce false positives or false negatives. Always do your own research. GuardFi AI does **not** have a token.

---

## ❗ Problem

Interacting with an unknown DeFi contract means trusting code you can't read. The most damaging risks are invisible to most users until it's too late:

- 🔑 Hidden owner privileges
- 🪙 Unlimited minting
- 🚫 Blacklist / pause controls
- ♻️ Upgradeable proxies
- ❓ Unverified source code

Formal audits are slow and expensive, and even when a "report" exists, users have no easy way to verify it hasn't been tampered with.

---

## 💡 Solution

GuardFi AI turns contract risk into **verifiable intelligence** in five steps:

| Step | What happens |
|:--:|---|
| **1. Scan** 🔍 | Read the contract's on-chain bytecode and metadata. |
| **2. Score** 📊 | A deterministic rule engine produces a 0–100 risk score with machine- and human-readable indicators. |
| **3. Explain** 🧠 | An AI report (DeepSeek) explains the deterministic findings in plain language, with a deterministic fallback when AI is unavailable. |
| **4. Prove** 🔐 | The user's own wallet anchors a minimal report commitment (hash + metadata) in the `GuardFiReportRegistry` contract on HashKey Chain. |
| **5. Verify** ✅ | Anyone can publicly look up a report by ID and confirm it exists on-chain — no wallet required. |

---

## ✨ Key Features

- 🔗 Real wallet connection (wagmi + viem + RainbowKit) on **HashKey Chain mainnet** (chainId 177).
- 🎯 Deterministic, inspectable risk engine (reproducible score + versioned ruleset).
- 🧪 Best-effort on-chain analysis: bytecode presence, ERC-20 metadata, EIP-1967 proxy signal, 4-byte selector scan.
- 🤖 AI report generator via **DeepSeek** with a **deterministic fallback** (never crashes without an API key).
- 🧾 `keccak256` report hashing and **wallet-signed** on-chain `submitReport()`.
- 🌐 Public, wallet-free report verification page.
- 📈 Wallet-based dashboard aggregating local scan/report/proof/unlock activity.
- 💎 HSP premium unlock via an **adapter** (mock adapter for demo; real adapter is a documented skeleton).

---

## 🟣 Why HashKey Chain

The `GuardFiReportRegistry` contract is deployed on **HashKey Chain mainnet**, so report commitments live on a real, EVM-compatible chain with a public explorer (Blockscout). This makes every report independently and permanently verifiable, and keeps GuardFi AI aligned with the HashKey ecosystem it analyzes.

---

## 🧠 How AI Is Used

The AI (DeepSeek) is given **only** the deterministic scan result and is instructed to explain it — never to invent vulnerabilities, token data, audit status, liquidity, holders, exploit history, or financial advice.

Output is strict JSON, validated and sanitized (forbidden claims like "guaranteed safe" / "formal audit" are stripped). If `DEEPSEEK_API_KEY` is not set or the call fails, GuardFi AI produces a **deterministic fallback report** from the same indicators — so the feature always works.

---

## 🔐 How On-Chain Proof Works

The full report stays **off-chain**. Only a minimal commitment is stored on-chain via `submitReport(target, score, reportHash, metadataURI)`:

| Field | Meaning |
|---|---|
| `reportHash` | `keccak256` of a **deterministic** report payload (stable, sorted JSON). |
| `metadataURI` | A reference to the off-chain report. |
| `reporter` | The connected wallet (`msg.sender`), which signs the transaction. |

> The backend never submits transactions. Anyone can call `getReport(reportId)` to read the commitment and verify integrity.

---

## 💎 How HSP Is Used

The full AI report is a **premium product** unlocked with **HSP**. Payment is handled behind an `HspAdapter` interface so the provider can be swapped without touching the app.

- A **mock adapter** (clearly labeled _"Mock HSP Mode"_) powers the demo.
- A **real adapter skeleton** is included and, until configured, reports _"HSP adapter is not configured."_

Payment **does not** change the on-chain report hash — the registry remains a public proof layer.

---

## 🧰 Tech Stack

| Layer | Stack |
|---|---|
| **Frontend** | Next.js 16 (App Router), TypeScript, Tailwind CSS, Framer Motion |
| **Wallet** | wagmi, viem, RainbowKit |
| **AI** | DeepSeek (`deepseek-v4-flash`) + deterministic fallback |
| **Contract** | Solidity 0.8.24, Hardhat, ethers v6 |
| **Chain** | HashKey Chain mainnet (chainId 177) |
| **Tests** | Vitest (frontend), Hardhat/Mocha/Chai (contract) |

---

## 🏗️ Architecture Overview

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

📄 See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for full flow diagrams.

---

## 🔗 Live Deployment

| Item | Value |
|---|---|
| **Registry contract** | [`0xBa0422Df609cA9f0E6157Da62075aa12316801Ea`](https://hashkey.blockscout.com/address/0xBa0422Df609cA9f0E6157Da62075aa12316801Ea) |
| **Example transaction** | [`0x33fb6c21…8828a1fb`](https://hashkey.blockscout.com/tx/0x33fb6c21f30f2d492085e10ae6a8277327e57f59d019408c307dffd88828a1fb) |
| **Explorer** | https://hashkey.blockscout.com |
| **Example verify Report ID** | `1` |

---

## 🚀 Demo Flow

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

📜 Full script: [`docs/DEMO_SCRIPT.md`](docs/DEMO_SCRIPT.md).

---

## ⚙️ Local Setup

> **Prerequisites:** Node.js 18+ and npm. A browser wallet (e.g. MetaMask) for the app.

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

---

## 🔑 Environment Variables

See [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md) for the full reference. Quick notes:

> [!IMPORTANT]
> - **Never commit `.env` / `.env.local`.**
> - `DEEPSEEK_API_KEY`, `HSP_API_KEY`, `PRIVATE_KEY_DEPLOYER` are **server/secret** — never prefix with `NEXT_PUBLIC_`.
> - With no `DEEPSEEK_API_KEY`, the AI report falls back deterministically. Set `NEXT_PUBLIC_HSP_MODE=mock` for the demo unlock flow.

---

## 🧾 Commands

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

---

## 🧪 Testing

- **Frontend:** `cd apps/web && npm test` — Vitest covers the risk engine, AI report (fallback/parser/sanitizer), HSP (mock adapter/storage/config/service), and dashboard aggregation.
- **Contracts:** `cd apps/contracts && npm test` — Hardhat covers `submitReport`, `getReport`, indexing, and validation reverts.
- **Full manual checklist:** [`docs/TESTING_CHECKLIST.md`](docs/TESTING_CHECKLIST.md).

---

## 📦 Deployment Notes

- The registry is deployed manually with `npm run deploy:hashkey`; nothing deploys automatically. The deployer wallet must hold **HSK** for gas.
- After deploy, set `NEXT_PUBLIC_REGISTRY_ADDRESS` in the frontend. See [`apps/contracts/docs/contract-deployment.md`](apps/contracts/docs/contract-deployment.md).
- If write/estimate RPC calls return 403 on `https://mainnet.hsk.xyz`, use the managed RPC `https://hashkeychain-mainnet.alt.technology`.

---

## 🔒 Security & Disclaimer

- GuardFi AI is **automated risk intelligence, not a formal audit and not financial advice.**
- Detection is best-effort; absence of a signal does **not** guarantee safety.
- MVP data (scan results, AI reports, unlock state) is stored in the browser (`localStorage`/`sessionStorage`). Production must verify payment/access server-side and persist data properly.
- The full report stays off-chain; only a minimal commitment is on-chain.
- GuardFi AI has **no token**.

---

## 🏆 Hackathon Relevance

GuardFi AI targets the **DeFi + AI** intersection on HashKey Chain: a real mainnet smart contract for verifiable proofs, AI used responsibly (explaining deterministic findings, not fabricating them), and HSP as the premium-access settlement layer.

📄 See [`docs/SUBMISSION.md`](docs/SUBMISSION.md) and [`docs/PITCH.md`](docs/PITCH.md).

---

## 👤 Author

<div align="center">

<img src="apps/web/public/guardfi-logo.png" alt="GuardFi AI" width="72" />

### Build in **Ardian3D**

Designed, built, and shipped for the **HashKey Chain Hackathon**.

[![HashKey](https://img.shields.io/badge/HashKey_Chain-mainnet-6366f1?style=flat-square)](https://hashkey.blockscout.com)
[![Made with](https://img.shields.io/badge/Made_with-🛡️_%2B_☕-22c55e?style=flat-square)](#)

</div>

---

<div align="center">

<br/>

## ⚡ Build in Ardian3D ⚡

<sub>Made with 🛡️ for a safer DeFi on HashKey Chain</sub>

<br/><br/>

<sub><i>GuardFi AI — automated risk intelligence, not a formal audit and not financial advice.</i></sub>

</div>
