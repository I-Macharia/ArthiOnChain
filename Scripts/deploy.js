const {
  Client,
  ContractCreateFlow,
  PrivateKey,
  ContractFunctionParameters,
  Hbar
} = require("@hashgraph/sdk");
const fs = require("fs");

// Read the contract bytecode from the JSON file
const contractBytecode = JSON.parse(
  fs.readFileSync("artifacts/contracts/LandTitleRegistry.sol/LandTitleRegistry.json")
).bytecode;

async function main() {
  // Hedera credentials from environment variables
  const operatorKey = PrivateKey.fromString(process.env.HEDERA_PRIVATE_KEY);
  const operatorId = process.env.HEDERA_ACCOUNT_ID;

  if (!operatorKey || !operatorId) {
    throw new Error("Environment variables HEDERA_PRIVATE_KEY and HEDERA_ACCOUNT_ID must be present");
  }

  // Create Hedera client
  const client = Client.forTestnet();  // Use .forMainnet() for production
  client.setOperator(operatorId, operatorKey);

  console.log("Deploying LandTitleRegistry contract to Hedera...");

  // Create the contract
  let contractCreateTx = new ContractCreateFlow()
    .setGas(800000)  // Set gas limit
    .setBytecode(contractBytecode)
    .setConstructorParameters(new ContractFunctionParameters())
    .setMaxTransactionFee(new Hbar(20));  // Set the max transaction fee

  // Sign and submit the transaction
  const contractCreateSubmit = await contractCreateTx.execute(client);

  // Get the receipt of the transaction
  const contractCreateReceipt = await contractCreateSubmit.getReceipt(client);

  // Get the contract ID
  const contractId = contractCreateReceipt.contractId;

  console.log(`LandTitleRegistry deployed to: ${contractId}`);

  // Also save the contract ID to a file for future reference
  fs.writeFileSync(
    "contract-address.json",
    JSON.stringify({ contractId: contractId.toString() }, null, 2)
  );

  // Release client resources
  client.close();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Land Title System", function () {
  let LandTitleRegistry, landTitleRegistry;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Deploy LandTitleRegistry
    LandTitleRegistry = await ethers.getContractFactory("LandTitleRegistry");
    landTitleRegistry = await LandTitleRegistry.deploy();
    await landTitleRegistry.deployed();
  });

  describe("Land Title Registration", function () {
    it("Should register a new land title", async function () {
      const landId = 1;
      const location = "123 Main St";
      const area = 1000;
      const documentHash = "QmHash123";

      await expect(landTitleRegistry.registerLandTitle(
        landId,
        addr1.address,
        location,
        area,
        documentHash
      ))
        .to.emit(landTitleRegistry, "LandTitleRegistered")
        .withArgs(landId, addr1.address, location, area, documentHash);

      const landDetails = await landTitleRegistry.getLandDetails(landId);
      expect(landDetails.isRegistered).to.be.true;
      expect(landDetails.ownerAddress).to.equal(addr1.address);
    });

    it("Should prevent non-government from registering", async function () {
      await expect(
        landTitleRegistry.connect(addr1).registerLandTitle(
          1,
          addr2.address,
          "456 Side St",
          500,
          "QmHash456"
        )
      ).to.be.revertedWith("Only the government can call this function");
    });

    it("Should update land title details", async function () {
      // First register
      await landTitleRegistry.registerLandTitle(
        1,
        addr1.address,
        "Original Location",
        1000,
        "QmHash123"
      );

      // Then update
      const newLocation = "New Location";
      const newArea = 1500;
      const newHash = "QmHash789";

      await expect(landTitleRegistry.updateLandDetails(
        1,
        addr2.address,
        newLocation,
        newArea,
        newHash
      ))
        .to.emit(landTitleRegistry, "LandTitleUpdated")
        .withArgs(1, addr2.address, newLocation, newArea, newHash);
    });
  });

  describe("Title Deed Tokenization", function () {
    it("Should mint token when registering land", async function () {
      const landId = 1;
      const documentHash = "QmHash123";

      await expect(landTitleRegistry.registerLandTitle(
        landId,
        addr1.address,
        "Test Location",
        1000,
        documentHash
      ))
        .to.emit(await landTitleRegistry.titleDeedTokenization(), "TokenMinted")
        .withArgs(addr1.address, 0, documentHash);
    });
  });
});