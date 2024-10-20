const { expect } = require("chai");
const { ethers } = require("hardhat");

/**
 * Login contract tests
 */
describe("Login Contract", function () {
it("Should register a user", async function () {
    await login.connect(addr1).register();
    const isRegistered = await login.isUserRegistered();
    expect(isRegistered).to.be.true;
});

it("Should verify if the caller is registered", async function () {
    await login.connect(addr1).register();
    const isRegistered = await login.connect(addr1).isUserRegistered();
    expect(isRegistered).to.be.true;
});

it("Should not allow already registered user to register again", async function () {
    await login.connect(addr1).register();
    await expect(login.connect(addr1).register()).to.be.revertedWith("User already registered");
});

it("Should revert if a non-registered user tries to interact with restricted functions", async function () {
    await expect(login.connect(addr1).isUserRegistered()).to.be.revertedWith(
    "You need to be a registered user"
    );
});
});