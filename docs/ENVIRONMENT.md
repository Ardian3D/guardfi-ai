# GuardFi AI — Environment Variables

> **Never commit `.env` / `.env.local`.** Copy the provided `.env.example` files and fill them locally.
>
> **Secrets must never be `NEXT_PUBLIC_`.** Anything prefixed `NEXT_PUBLIC_` is embedded in the browser bundle and is public.

## `apps/web` (`.env.local`)

| Variable | Public? | Required | Description |
|---|---|---|---|
| `NEXT_PUBLIC_REGISTRY_ADDRESS` | public | for on-chain submit/verify | Deployed `GuardFiReportRegistry` address on HashKey Chain. Example: `0xBa0422Df609cA9f0E6157Da62075aa12316801Ea`. |
| `NEXT_PUBLIC_HASHKEY_RPC_URL` | public | optional | Client-side RPC for read-only calls. Defaults to a HashKey RPC if unset. |
| `HASHKEY_RPC_URL` | server | optional | Server-side RPC used by the `/api/scans` scan engine. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | public | optional | WalletConnect project id (from cloud.reown.com). Injected wallets (MetaMask) work without it; a dev placeholder is used if empty. |
| `DEEPSEEK_API_KEY` | **server SECRET** | optional | DeepSeek key for AI reports. **Never `NEXT_PUBLIC_`.** If unset, the deterministic fallback is used. |
| `DEEPSEEK_MODEL` | server | optional | AI model. Default `deepseek-v4-flash`. |
| `NEXT_PUBLIC_HSP_MODE` | public | for demo | `mock` enables the mock HSP adapter (dev/demo). Any other value selects the real adapter skeleton. |
| `HSP_API_KEY` | **server SECRET** | for real HSP | HSP credential. **Server-side only**, never `NEXT_PUBLIC_`. |
| `HSP_API_BASE_URL` | server | for real HSP | HSP API base URL (used by the future server route). |
| `NEXT_PUBLIC_PREMIUM_REPORT_PRICE` | public | optional | Premium price shown in UI. Default `25`. |
| `NEXT_PUBLIC_PREMIUM_REPORT_CURRENCY` | public | optional | Premium currency shown in UI. Default `HSP`. |

Example:

```bash
NEXT_PUBLIC_REGISTRY_ADDRESS=0xBa0422Df609cA9f0E6157Da62075aa12316801Ea
NEXT_PUBLIC_HASHKEY_RPC_URL=https://mainnet.hsk.xyz
HASHKEY_RPC_URL=https://mainnet.hsk.xyz
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
DEEPSEEK_API_KEY=
DEEPSEEK_MODEL=deepseek-v4-flash
NEXT_PUBLIC_HSP_MODE=mock
HSP_API_KEY=
HSP_API_BASE_URL=
NEXT_PUBLIC_PREMIUM_REPORT_PRICE=25
NEXT_PUBLIC_PREMIUM_REPORT_CURRENCY=HSP
```

## `apps/contracts` (`.env`)

| Variable | Public? | Required | Description |
|---|---|---|---|
| `PRIVATE_KEY_DEPLOYER` | **SECRET** | to deploy | Deployer wallet private key. **Never push this.** Must hold HSK for gas. |
| `HASHKEY_RPC_URL` | server | to deploy | HashKey Chain RPC. Example: `https://mainnet.hsk.xyz`. |
| `NEXT_PUBLIC_REGISTRY_ADDRESS` | public | after deploy | Filled in after deployment; copy to the frontend env. |

Example:

```bash
PRIVATE_KEY_DEPLOYER=
HASHKEY_RPC_URL=https://mainnet.hsk.xyz
NEXT_PUBLIC_REGISTRY_ADDRESS=
```

## Security rules

- `.env` and `.env.local` are git-ignored — keep it that way.
- `PRIVATE_KEY_DEPLOYER` must **never** be committed or shared. Prefer a fresh key funded with only the HSK needed to deploy.
- `DEEPSEEK_API_KEY` and `HSP_API_KEY` are **server-side only**; never expose via `NEXT_PUBLIC_`.
- If a public RPC returns 403 on write/estimate calls, use the managed RPC `https://hashkeychain-mainnet.alt.technology`.
