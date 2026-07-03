# GuardFiReportRegistry — Deployment Guide

`GuardFiReportRegistry` is the single on-chain contract for GuardFi AI. It
stores minimal **report commitments** (reporter, target, score, report hash,
metadata URI, timestamp) on **HashKey Chain mainnet**. The full AI report stays
off-chain. This is not a token — GuardFi AI has no token.

Workspace: `apps/contracts` (Hardhat + TypeScript).

---

## 1. Install dependencies

```bash
cd apps/contracts
npm install
```

## 2. Configure environment

Copy the example and fill in values:

```bash
cp .env.example .env
```

| Variable | Purpose |
|---|---|
| `PRIVATE_KEY_DEPLOYER` | Deployer wallet private key. **Never commit this.** |
| `HASHKEY_RPC_URL` | HashKey Chain RPC. Defaults to `https://mainnet.hsk.xyz`. |
| `NEXT_PUBLIC_REGISTRY_ADDRESS` | Filled in **after** deploy; consumed by the frontend. |

> The private key is read from `.env` by `hardhat.config.ts`. It is never
> hardcoded anywhere in the repo.

## 3. Compile

```bash
npm run compile
```

## 4. Run tests

```bash
npm test
```

Tests run against Hardhat's in-memory network (no real funds, no RPC needed).

## 5. Deploy to HashKey Chain mainnet

> Deployment is **manual and explicit** — nothing deploys automatically.

Make sure `PRIVATE_KEY_DEPLOYER` is set and the wallet holds **HSK** for gas,
then run:

```bash
npm run deploy:hashkey
```

This uses the `hashkey` network (chainId **177**, RPC from `HASHKEY_RPC_URL`)
and prints the deployed address, for example:

```
Network      : hashkey
Deployer     : 0x....
Balance      : 1.5 HSK
GuardFiReportRegistry deployed at: 0xABC...123
```

## 6. Save the deployed address

Copy the printed address into your environment so the frontend can use it:

```
NEXT_PUBLIC_REGISTRY_ADDRESS=0xABC...123
```

For the frontend, place this in `apps/web/.env.local`.

## 7. (Optional) Verify on Blockscout

The explorer is `https://hashkey.blockscout.com`. Contract verification is not
wired into this workspace to keep dependencies minimal; verify manually via the
Blockscout UI or add `@nomicfoundation/hardhat-verify` if needed.

---

## Warnings & manual checks

- **Gas:** the deployer wallet **must hold HSK** on HashKey Chain mainnet.
  A zero balance will cause the deploy to fail.
- **Mainnet is real:** double-check the network and account before deploying.
  There is no automatic mainnet deploy in CI.
- **Key hygiene:** never commit `.env`. Prefer a fresh deployer key funded with
  only the HSK needed for deployment.
- **No admin functions:** the contract has no owner, pause, or upgrade path by
  design. Redeploy if the logic must change.

---

## Network reference (HashKey Chain mainnet)

| Field | Value |
|---|---|
| Chain ID | `177` |
| RPC | `https://mainnet.hsk.xyz` |
| Native currency | `HSK` (18 decimals) |
| Explorer | `https://hashkey.blockscout.com` |
