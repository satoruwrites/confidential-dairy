import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:address", "Prints the ConfidentialDiary address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;

  const deployment = await deployments.get("ConfidentialDiary");

  console.log("ConfidentialDiary address is " + deployment.address);
});

task("task:submit-diary", "Stores an encrypted diary entry")
  .addParam("title", "Already encrypted diary title")
  .addParam("content", "Already encrypted diary content")
  .addOptionalParam("key", "Clear eight digit key", "12345678")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const keyValue = parseInt(taskArguments.key, 10);
    if (!Number.isInteger(keyValue)) {
      throw new Error("Argument --key must be an integer");
    }
    if (keyValue < 10000000 || keyValue > 99999999) {
      throw new Error("Argument --key must be an eight digit number");
    }

    await fhevm.initializeCLIApi();

    const deployment = await deployments.get("ConfidentialDiary");
    const signer = (await ethers.getSigners())[0];
    const contract = await ethers.getContractAt("ConfidentialDiary", deployment.address);

    const encryptedKey = await fhevm
      .createEncryptedInput(deployment.address, signer.address)
      .add32(keyValue)
      .encrypt();

    const tx = await contract
      .connect(signer)
      .submitDiary(
        encryptedKey.handles[0],
        encryptedKey.inputProof,
        taskArguments.title,
        taskArguments.content,
      );

    console.log(`Waiting for tx: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`Status: ${receipt?.status}`);
  });

task("task:decrypt-key", "Decrypts a diary key")
  .addParam("user", "Owner address")
  .addParam("index", "Diary index")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const indexValue = parseInt(taskArguments.index, 10);
    if (!Number.isInteger(indexValue)) {
      throw new Error("Argument --index must be an integer");
    }

    await fhevm.initializeCLIApi();

    const deployment = await deployments.get("ConfidentialDiary");
    const contract = await ethers.getContractAt("ConfidentialDiary", deployment.address);

    const entry = await contract.getDiary(taskArguments.user, indexValue);

    const signer = (await ethers.getSigners())[0];
    const clearKey = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      entry.encryptedKey,
      deployment.address,
      signer,
    );

    console.log(`Encrypted key: ${entry.encryptedKey}`);
    console.log(`Decrypted key: ${clearKey}`);
  });
