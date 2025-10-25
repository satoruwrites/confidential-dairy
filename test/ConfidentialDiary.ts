import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, fhevm } from "hardhat";
import { FhevmType } from "@fhevm/hardhat-plugin";
import { ConfidentialDiary, ConfidentialDiary__factory } from "../types";

type Signers = {
  deployer: HardhatEthersSigner;
  writer: HardhatEthersSigner;
  reader: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("ConfidentialDiary")) as ConfidentialDiary__factory;
  const contract = (await factory.deploy()) as ConfidentialDiary;
  const contractAddress = await contract.getAddress();

  return { contract, contractAddress };
}

describe("ConfidentialDiary", function () {
  let signers: Signers;
  let diaryContract: ConfidentialDiary;
  let diaryContractAddress: string;

  before(async function () {
    const [deployer, writer, reader] = await ethers.getSigners();
    signers = { deployer, writer, reader };
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("This hardhat test suite cannot run on Sepolia Testnet");
      this.skip();
    }

    ({ contract: diaryContract, contractAddress: diaryContractAddress } = await deployFixture());
  });

  it("stores diary entries with encrypted keys", async function () {
    const clearKey = 12345678;
    const encryptedTitle = "b64:encrypted-title";
    const encryptedContent = "b64:encrypted-content";

    const encryptedKey = await fhevm
      .createEncryptedInput(diaryContractAddress, signers.writer.address)
      .add32(clearKey)
      .encrypt();

    const tx = await diaryContract
      .connect(signers.writer)
      .submitDiary(
        encryptedKey.handles[0],
        encryptedKey.inputProof,
        encryptedTitle,
        encryptedContent,
      );

    await tx.wait();

    const count = await diaryContract.getDiaryCount(signers.writer.address);
    expect(count).to.equal(1);

    const entry = await diaryContract.getDiary(signers.writer.address, 0);
    expect(entry.encryptedTitle).to.equal(encryptedTitle);
    expect(entry.encryptedContent).to.equal(encryptedContent);
    expect(entry.createdAt).to.be.gt(0);

    const decryptedKey = await fhevm.userDecryptEuint(
      FhevmType.euint32,
      entry.encryptedKey,
      diaryContractAddress,
      signers.writer,
    );

    expect(decryptedKey).to.equal(clearKey);
  });

  it("returns full diary list and protects indexes", async function () {
    const firstKey = await fhevm
      .createEncryptedInput(diaryContractAddress, signers.writer.address)
      .add32(12345678)
      .encrypt();

    await diaryContract
      .connect(signers.writer)
      .submitDiary(firstKey.handles[0], firstKey.inputProof, "first", "entry");

    const secondKey = await fhevm
      .createEncryptedInput(diaryContractAddress, signers.writer.address)
      .add32(87654321)
      .encrypt();

    await diaryContract
      .connect(signers.writer)
      .submitDiary(secondKey.handles[0], secondKey.inputProof, "second", "entry2");

    const list = await diaryContract.listDiaries(signers.writer.address);
    expect(list.length).to.equal(2);
    expect(list[0].encryptedTitle).to.equal("first");
    expect(list[1].encryptedTitle).to.equal("second");

    await expect(diaryContract.getDiary(signers.writer.address, 2)).to.be.revertedWith("Invalid diary index");
  });
});
