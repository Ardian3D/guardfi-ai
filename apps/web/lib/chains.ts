import { defineChain } from "viem";

/**
 * HashKey Chain mainnet (chainId 177) — the network GuardFi AI targets.
 * Values sourced from PRD §8.1.
 */
export const hashKeyChain = defineChain({
  id: 177,
  name: "HashKey Chain",
  nativeCurrency: {
    name: "HSK",
    symbol: "HSK",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      // alt.technology managed RPC is more reliable for writes; hsk.xyz fallback.
      http: [
        "https://hashkeychain-mainnet.alt.technology",
        "https://mainnet.hsk.xyz",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "HashKey Blockscout",
      url: "https://hashkey.blockscout.com",
    },
  },
});

/** The single chain id the app treats as "correct network". */
export const REQUIRED_CHAIN_ID = hashKeyChain.id;
