import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ZamailSimple contract to Sepolia...");

  const ZamailSimple = await ethers.getContractFactory("ZamailSimple");
  const zamailSimple = await ZamailSimple.deploy();

  await zamailSimple.waitForDeployment();

  const address = await zamailSimple.getAddress();
  console.log("ZamailSimple deployed to:", address);
  console.log("Contract owner:", await zamailSimple.owner());
  
  console.log("\nContract details:");
  console.log("- Registration fee: 0.001 ETH");
  console.log("- Send mail fee: 0.0001 ETH");
  console.log("- Network: Sepolia");
  
  console.log("\n✅ Deployment successful!");
  console.log("Update frontend lib/contracts.ts with new address:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
