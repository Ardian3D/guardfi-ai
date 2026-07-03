import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { hashKeyChain } from "./chains";

/**
 * WalletConnect project id. Injected wallets (e.g. MetaMask) work without a
 * real one; WalletConnect-based wallets need a real id from
 * https://cloud.reown.com. Set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your env.
 *
 * `|| fallback` (not `??`) so an empty string in .env also falls back — a
 * non-empty value is required or RainbowKit throws "No projectId found".
 */
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?.trim() ||
  "guardfi_dev_placeholder_projectid";

/**
 * wagmi + RainbowKit config. `ssr: true` is required for the Next.js App
 * Router so the server render doesn't assume a connected wallet (prevents
 * hydration mismatches).
 */
export const wagmiConfig = getDefaultConfig({
  appName: "GuardFi AI",
  projectId,
  chains: [hashKeyChain],
  ssr: true,
});
