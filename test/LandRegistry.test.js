const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Land Registry System", function () {
    let TitleDeedToken;
    let titleDeedToken;
    let LandRegistry;
    let landRegistry;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2] = await ethers.getSigners();

        // Deploy TitleDeedToken
        TitleDeedToken = await ethers.getContractFactory("TitleDeedToken");
        titleDeedToken = await TitleDeedToken.deploy();
        await titleDeedToken.waitForDeployment();

        // Deploy LandRegistry
        LandRegistry = await ethers.getContractFactory("LandRegistry");
        landRegistry = await LandRegistry.deploy(owner.address, await titleDeedToken.getAddress());
        await landRegistry.waitForDeployment();

        // Grant MINTER_ROLE to landRegistry
        const MINTER_ROLE = await titleDeedToken.MINTER_ROLE();
        await titleDeedToken.grantRole(MINTER_ROLE, await landRegistry.getAddress());
    });

    describe("Land Registry", function () {
        it("Should register a new land title", async function () {
            const landId = 1;
            const location = "123 Main St";
            const area = 1000;
            const documentHash = "QmXyZ..."; // IPFS hash or any document reference

            await expect(landRegistry.registerLandTitle(
                landId,
                addr1.address,
                location,
                area,
                documentHash
            ))
                .to.emit(landRegistry, "LandTitleRegistered")
                .withArgs(landId, addr1.address, location, area, documentHash, 0); // First token ID will be 0

            const landTitle = await landRegistry.landTitles(landId);
            expect(landTitle.isRegistered).to.equal(true);
            expect(landTitle.ownerAddress).to.equal(addr1.address);
            expect(landTitle.location).to.equal(location);
            expect(landTitle.area).to.equal(area);
            expect(landTitle.documentHash).to.equal(documentHash);

            // Check token ownership
            expect(await titleDeedToken.ownerOf(0)).to.equal(addr1.address);
            expect(await titleDeedToken.getDocumentHash(0)).to.equal(documentHash);
        });

        it("Should prevent registering the same land ID twice", async function () {
            const landId = 2;

            await landRegistry.registerLandTitle(
                landId,
                addr1.address,
                "456 Second St",
                800,
                "QmAbc..."
            );

            await expect(landRegistry.registerLandTitle(
                landId,
                addr2.address,
                "Different location",
                500,
                "QmDef..."
            )).to.be.revertedWith("Already registered");
        });

        it("Should prevent registering land with invalid area", async function () {
            await expect(landRegistry.registerLandTitle(
                3,
                addr1.address,
                "789 Third St",
                0, // Invalid area
                "QmGhi..."
            )).to.be.revertedWith("Invalid area");
        });

        it("Should prevent non-owners from registering land", async function () {
            await expect(landRegistry.connect(addr1).registerLandTitle(
                4,
                addr2.address,
                "101 Fourth St",
                1200,
                "QmJkl..."
            )).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("TitleDeedToken", function () {
        it("Should mint tokens only through authorized minters", async function () {
            // LandRegistry is authorized to mint
            await landRegistry.registerLandTitle(5, addr2.address, "555 Fifth St", 1500, "QmMno...");

            // Direct minting should fail for unauthorized accounts
            const MINTER_ROLE = await titleDeedToken.MINTER_ROLE();
            await expect(
                titleDeedToken.connect(addr1).mintToken(addr2.address, "QmPqr...")
            ).to.be.revertedWith(
                `AccessControl: account ${addr1.address.toLowerCase()} is missing role ${MINTER_ROLE}`
            );
        });
    });
});