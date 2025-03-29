const { expect } = require("chai");

describe("HelloWorld Contract", function () {
    it("Should return 'Hello, World!'", async function () {
        const HelloWorld = await ethers.getContractFactory("HelloWorld");
        const helloWorld = await HelloWorld.deploy();
        await helloWorld.deployed();

        expect(await helloWorld.sayHello()).to.equal("Hello, World!");
    });
});