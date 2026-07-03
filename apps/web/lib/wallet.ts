"use client";

import { useAccount } from "wagmi";
import { REQUIRED_CHAIN_ID } from "./chains";

/**
 * Wallet adapter over wagmi. This is the single source of truth for wallet
 * state across the app — it reads the *real* connection from wagmi, not
 * localStorage. (Phase 2 replaced the Phase 1 mock store.)
 */
export type WalletView = {
  /** Wallet is connected (reconnect settled). */
  connected: boolean;
  /** Still determining connection (initial reconnect in progress). */
  connecting: boolean;
  address: `0x${string}` | undefined;
  chainId: number | undefined;
  /** Connected AND on HashKey Chain (177). */
  correctNetwork: boolean;
  /** Connected but on the wrong chain. */
  wrongNetwork: boolean;
};

export function useWallet(): WalletView {
  const { address, isConnected, chainId, status } = useAccount();

  const connecting = status === "connecting" || status === "reconnecting";
  const correctNetwork = isConnected && chainId === REQUIRED_CHAIN_ID;

  return {
    connected: isConnected,
    connecting,
    address,
    chainId,
    correctNetwork,
    wrongNetwork: isConnected && chainId !== REQUIRED_CHAIN_ID,
  };
}

/** Fully ready to use the gated app: connected + on the right chain. */
export function isAppReady(w: WalletView) {
  return w.connected && w.correctNetwork;
}

/** 0x81a3…7bC9 style short address. */
export function shortenAddress(address?: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}
