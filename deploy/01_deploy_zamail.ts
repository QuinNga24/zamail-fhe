import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  console.log(`Deploying Zamail contract with account: ${deployer}`);

  const deployedZamail = await deploy("Zamail", {
    from: deployer,
    log: true,
  });

  console.log(`Zamail contract deployed at: ${deployedZamail.address}`);
};

export default func;
func.id = "deploy_zamail"; // id required to prevent reexecution
func.tags = ["Zamail"];
