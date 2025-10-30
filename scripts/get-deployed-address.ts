import * as fs from "fs";
import * as path from "path";

async function getDeployedAddress() {
  const deploymentsPath = path.join(
    __dirname,
    "../deployments/sepolia/Zamail.json"
  );

  if (!fs.existsSync(deploymentsPath)) {
    console.error("❌ Deployment info not found.");
    console.log("📝 Run: npx hardhat deploy --network sepolia");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentsPath, "utf-8"));
  const contractAddress = deployment.address;

  console.log(`\n✅ Zamail Contract Address (Sepolia):`);
  console.log(`   ${contractAddress}`);
  console.log(`\n📋 Etherscan Link:`);
  console.log(`   https://sepolia.etherscan.io/address/${contractAddress}`);

  // Save to frontend env
  const envPath = path.join(__dirname, "../.env.local");
  const envContent = `VITE_ZAMAIL_ADDRESS=${contractAddress}\n`;

  fs.appendFileSync(envPath, envContent);
  console.log(`\n✅ Added to .env.local`);

  return contractAddress;
}

getDeployedAddress().catch(console.error);
