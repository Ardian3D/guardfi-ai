import { ethers, network } from "hardhat";

/**
 * Deploys GuardFiReportRegistry.
 *
 * Usage:
 *   npm run deploy:hashkey        # deploy to HashKey Chain mainnet (chainId 177)
 *
 * Requires in .env:
 *   PRIVATE_KEY_DEPLOYER   deployer key (must hold HSK for gas)
 *   HASHKEY_RPC_URL        HashKey Chain RPC (defaults to https://mainnet.hsk.xyz)
 *
 * The private key is NEVER hardcoded — it is read from the environment by
 * hardhat.config.ts.
 */
async function main() {
  const signers = await ethers.getSigners();
  if (signers.length === 0) {
    throw new Error(
      "No deployer account configured. Set PRIVATE_KEY_DEPLOYER in .env before deploying."
    );
  }

  const deployer = signers[0];
  const balance = await ethers.provider.getBalance(deployer.address);

  console.log("Network      :", network.name);
  console.log("Deployer     :", deployer.address);
  console.log("Balance      :", ethers.formatEther(balance), "HSK");

  if (balance === 0n) {
    console.warn(
      "WARNING: deployer balance is 0. The deployment will fail without HSK for gas."
    );
  }

  const factory = await ethers.getContractFactory("GuardFiReportRegistry");
  const registry = await factory.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("");
  console.log("GuardFiReportRegistry deployed at:", address);
  console.log("");
  console.log("Next step: put this in your .env as");
  console.log(`NEXT_PUBLIC_REGISTRY_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
