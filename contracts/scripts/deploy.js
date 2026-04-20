const { ethers } = require("hardhat");

// Celo mainnet cUSD
const CUSD_MAINNET = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
// Celo Alfajores testnet cUSD
const CUSD_ALFAJORES = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

async function main() {
  const network = await ethers.provider.getNetwork();
  const isMainnet = network.chainId === 42220n;
  const cUSD = isMainnet ? CUSD_MAINNET : CUSD_ALFAJORES;

  console.log(`\n🚀 Deploying BDeshSavings to ${isMainnet ? "Celo Mainnet" : "Alfajores Testnet"}...`);
  console.log(`📍 cUSD address: ${cUSD}`);

  const [deployer] = await ethers.getSigners();
  console.log(`👛 Deployer: ${deployer.address}`);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${ethers.formatEther(balance)} CELO\n`);

  const BDeshSavings = await ethers.getContractFactory("BDeshSavings");
  const contract = await BDeshSavings.deploy(cUSD);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`✅ BDeshSavings deployed at: ${address}`);
  console.log(`\n🔗 CeloScan: https://celoscan.io/address/${address}`);
  console.log(`\n📝 Update your src/lib/wagmi-config.ts:`);
  console.log(`   BDESH_SAVINGS_ADDRESS = "${address}"`);

  // Verify
  if (process.env.CELOSCAN_API_KEY) {
    console.log("\n⏳ Waiting 5s before verification...");
    await new Promise((r) => setTimeout(r, 5000));
    try {
      await run("verify:verify", {
        address,
        constructorArguments: [cUSD],
      });
      console.log("✅ Contract verified on CeloScan!");
    } catch (err) {
      console.log("⚠️  Verification failed:", err.message);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
