import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-network-helpers";
import "dotenv/config";

const HASHKEY_RPC_URL =
  process.env.HASHKEY_RPC_URL ?? "https://mainnet.hsk.xyz";
const PRIVATE_KEY_DEPLOYER = process.env.PRIVATE_KEY_DEPLOYER;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    // Local in-memory network used for `hardhat test`.
    hardhat: {},
    // HashKey Chain mainnet (chainId 177). Only used for explicit deploys.
    hashkey: {
      url: HASHKEY_RPC_URL,
      chainId: 177,
      accounts: PRIVATE_KEY_DEPLOYER ? [PRIVATE_KEY_DEPLOYER] : [],
    },
  },
};

export default config;
