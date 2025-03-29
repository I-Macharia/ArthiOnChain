const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Land Registry System", function() {
    let titleDeedToken;
    let landRegistry;
    let owner;
    let user;
    
    beforeEach(async function() {
        [owner, user] = await ethers.getSigners();
        
        const TitleDeedToken = await ethers.getContractFactory("TitleDeedToken");
        titleDeedToken = await TitleDeedToken.deploy();
        await titleDeedToken.deployed();
        
        const LandRegistry = await ethers.getContractFactory("LandRegistry");
        landRegistry = await LandRegistry.deploy(titleDeedToken.address);
        await landRegistry.deployed();
        
        await titleDeedToken.grantRole(
            await titleDeedToken.MINTER_ROLE(),
            landRegistry.address
        );
    });
    
    describe("Land Registration", function() {
        it("should register new land title and mint token", async function() {
            const tx = await landRegistry.registerLandTitle(
                1,
                user.address,
                "Test Location",
                1000,
                "QmHash123"
            );
            
            await expect(tx)
                .to.emit(landRegistry, "LandTitleRegistered")
                .withArgs(1, user.address, "Test Location", 1000, "QmHash123", 0);
            
            const title = await landRegistry.landTitles(1);
            expect(title.isRegistered).to.be.true;
            expect(title.ownerAddress).to.equal(user.address);
        });
    });
});