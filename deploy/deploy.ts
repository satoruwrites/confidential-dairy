import * as dotenv from "dotenv";
dotenv.config();

import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const infuraKey = process.env.INFURA_API_KEY;
  if (!infuraKey || infuraKey.trim().length === 0) {
    throw new Error("INFURA_API_KEY is not configured");
  }

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedDiary = await deploy("ConfidentialDiary", {
    from: deployer,
    log: true,
  });

  console.log("ConfidentialDiary contract:", deployedDiary.address);
};

export default func;
func.id = "deploy_confidential_diary"; // id required to prevent reexecution
func.tags = ["ConfidentialDiary"];
