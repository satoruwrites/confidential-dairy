import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, deployments, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { ConfidentialDiary } from "../types";

type Signers = {
  writer: HardhatEthersSigner;
};

describe("ConfidentialDiarySepolia", function () {
  let signers: Signers;
  let diaryContract: ConfidentialDiary;
  let diaryContractAddress: string;
  let currentSteps = 0;
  let totalSteps = 0;

  function progress(message: string) {
    console.log(`${++currentSteps}/${totalSteps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn("This hardhat test suite can only run on Sepolia Testnet");
      this.skip();
    }

    try {
      const deployment = await deployments.get("ConfidentialDiary");
      diaryContractAddress = deployment.address;
      diaryContract = (await ethers.getContractAt("ConfidentialDiary", deployment.address)) as ConfidentialDiary;
    } catch (error) {
      (error as Error).message += ". Call 'npx hardhat deploy --network sepolia' first.";
      throw error;
    }

    const [writer] = await ethers.getSigners();
    signers = { writer };
  });

  beforeEach(function () {
    currentSteps = 0;
    totalSteps = 0;
  });

  it("submits a diary and decrypts its key", async function () {
    totalSteps = 6;
    this.timeout(4 * 40000);

    progress("Encrypting diary key");
    const encryptedKey = await fhevm
      .createEncryptedInput(diaryContractAddress, signers.writer.address)
      .add32(12345678)
      .encrypt();

    progress("Submitting diary entry");
    const tx = await diaryContract
      .connect(signers.writer)
      .submitDiary(encryptedKey.handles[0], encryptedKey.inputProof, "sepolia-title", "sepolia-content");

    await tx.wait();

    progress("Fetching diary count");
    const count = await diaryContract.getDiaryCount(signers.writer.address);
    expect(count).to.be.greaterThan(0);

    progress("Retrieving diary entry");
    const lastIndex = Number(count) - 1;
    const entry = await diaryContract.getDiary(signers.writer.address, lastIndex);

    progress("Decrypting diary key");
    const clearKey = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      entry.encryptedKey,
      diaryContractAddress,
      signers.writer,
    );

    progress("Validating clear key");
    expect(clearKey).to.equal(12345678);
  });
});
