const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Land Title Registry and Tokenization Contracts", function () {
  let LandTitleRegistry, landTitleRegistry;
  let Login, login;
  let TitleDeedTokenization, tokenization;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();

    // Deploy Login contract
    Login = await ethers.getContractFactory("Login");
    login = await Login.deploy();
    await login.deployed();

    // Deploy Land Title Registry contract
    LandTitleRegistry = await ethers.getContractFactory("LandTitleRegistry");
    landTitleRegistry = await LandTitleRegistry.deploy();
    await landTitleRegistry.deployed();

    // Deploy Title Deed Tokenization contract
    TitleDeedTokenization = await ethers.getContractFactory("TitleDeedTokenization");
    tokenization = await TitleDeedTokenization.deploy(landTitleRegistry.address);
    await tokenization.deployed();
  });
});

/**
   * LandTitleRegistry contract tests
   */
describe("Land Title Registry Contract", function () {
    it("Should register a land title", async function () {
      await landTitleRegistry.registerLandTitle(1, addr1.address, "Location", 1000, "documentHash");
      const details = await landTitleRegistry.getLandDetails(1);

      expect(details.ownerAddress).to.equal(addr1.address);
      expect(details.location).to.equal("Location");
      expect(details.area).to.equal(1000);
      expect(details.documentHash).to.equal("documentHash");
    });

    it("Should not allow registering a land title with the same ID twice", async function () {
      await landTitleRegistry.registerLandTitle(1, addr1.address, "Location", 1000, "documentHash");
      await expect(
        landTitleRegistry.registerLandTitle(1, addr1.address, "NewLocation", 2000, "newHash")
      ).to.be.revertedWith("Land title already registered");
    });

    it("Should retrieve correct land details", async function () {
      await landTitleRegistry.registerLandTitle(1, addr1.address, "Location", 1000, "documentHash");
      const details = await landTitleRegistry.getLandDetails(1);

      expect(details.ownerAddress).to.equal(addr1.address);
      expect(details.location).to.equal("Location");
      expect(details.area).to.equal(1000);
      expect(details.documentHash).to.equal("documentHash");
    });
  });