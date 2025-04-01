// scripts/interact.js
async function main() {
    const [owner, user1] = await ethers.getSigners();

    // Get contract addresses from your deployment
    const landRegistryAddress = "0x..."; // Put your deployed contract address here
    const titleDeedTokenAddress = "0x..."; // Put your deployed contract address here

    // Connect to deployed contracts
    const LandRegistry = await ethers.getContractFactory("LandRegistry");
    const landRegistry = await LandRegistry.attach(landRegistryAddress);

    const TitleDeedToken = await ethers.getContractFactory("TitleDeedToken");
    const titleDeedToken = await TitleDeedToken.attach(titleDeedTokenAddress);

    // Register a land title
    console.log("Registering land title...");
    const tx = await landRegistry.registerLandTitle(
        1, // Land ID
        user1.address, // Owner
        "123 Main St", // Location
        1000, // Area
        "QmXyZ..." // Document hash
    );
    await tx.wait();
    console.log("Land title registered!");

    // Get land title details
    const landTitle = await landRegistry.landTitles(1);
    console.log("Land Title Details:");
    console.log("  Owner:", landTitle.ownerAddress);
    console.log("  Location:", landTitle.location);
    console.log("  Area:", landTitle.area.toString());
    console.log("  Document Hash:", landTitle.documentHash);
    console.log("  Token ID:", landTitle.tokenId.toString());

    // Check token ownership
    const tokenOwner = await titleDeedToken.ownerOf(landTitle.tokenId);
    console.log("Token Owner:", tokenOwner);

    // Get document hash from token
    const docHash = await titleDeedToken.getDocumentHash(landTitle.tokenId);
    console.log("Document Hash from Token:", docHash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });