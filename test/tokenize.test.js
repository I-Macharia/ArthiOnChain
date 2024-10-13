const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
   * TitleDeedTokenization contract tests
   */
describe("Title Deed Tokenization Contract", function () {
    it("Should mint a new token by converting a scanned document", async function () {
      const scannedDocument = "scannedDocumentHash";
      await tokenization.mintToken(addr1.address, scannedDocument);

      const documentHash = await tokenization.getDocumentHash(0);
      expect(documentHash).to.equal(scannedDocument);
    });

    it("Should get document hash of a token", async function () {
      const scannedDocument = "scannedDocumentHash";
      await tokenization.mintToken(addr1.address, scannedDocument);

      const documentHash = await tokenization.getDocumentHash(0);
      expect(documentHash).to.equal(scannedDocument);
    });

    it("Should revert if trying to get a document hash of a non-existent token", async function () {
      await expect(tokenization.getDocumentHash(999)).to.be.revertedWith("Token does not exist");
    });
  });