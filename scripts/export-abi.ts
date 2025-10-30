import * as fs from "fs";
import * as path from "path";

async function exportABIs() {
  const artifactsDir = path.join(__dirname, "../artifacts/contracts");
  const outputDir = path.join(__dirname, "../abis");

  // Create abis directory if not exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get all JSON files in artifacts
  const contracts = [
    "Zamail.sol/Zamail.json",
    "FHECounter.sol/FHECounter.json",
  ];

  contracts.forEach((contractPath) => {
    const artifactPath = path.join(artifactsDir, contractPath);
    const contractName = contractPath.split("/")[1].replace(".json", "");

    if (fs.existsSync(artifactPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf-8"));
      const abiPath = path.join(outputDir, `${contractName}.json`);

      // Extract only ABI
      const abi = artifact.abi;

      fs.writeFileSync(abiPath, JSON.stringify(abi, null, 2));
      console.log(`✅ Exported ${contractName} ABI to ${abiPath}`);
    } else {
      console.warn(`⚠️ Artifact not found: ${artifactPath}`);
    }
  });
}

exportABIs().catch(console.error);
