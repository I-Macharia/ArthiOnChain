// scripts/test-land-registry.js
async function main() {
	const [owner, user1, user2] = await ethers.getSigners();
	console.log("Owner address:", owner.address);
	console.log("User1 address:", user1.address);

	// Deploy TitleDeedToken
	console.log("\nDeploying TitleDeedToken...");
	const TitleDeedToken = await ethers.getContractFactory("TitleDeedToken");
	const titleDeedToken = await TitleDeedToken.deploy();
	await titleDeedToken.waitForDeployment();
	console.log("TitleDeedToken deployed to:", await titleDeedToken.getAddress());

	// Deploy LandRegistry
	console.log("\nDeploying LandRegistry...");
	const LandRegistry = await ethers.getContractFactory("LandRegistry");
	const landRegistry = await LandRegistry.deploy(owner.address, await titleDeedToken.getAddress());
	await landRegistry.waitForDeployment();
	console.log("LandRegistry deployed to:", await landRegistry.getAddress());

	// Grant MINTER_ROLE to landRegistry
	console.log("\nGranting MINTER_ROLE to LandRegistry...");
	const MINTER_ROLE = await titleDeedToken.MINTER_ROLE();
	await titleDeedToken.grantRole(MINTER_ROLE, await landRegistry.getAddress());
	console.log("MINTER_ROLE granted successfully");

	// Register a land title
	console.log("\nRegistering a land title...");
	const tx = await landRegistry.registerLandTitle(
		1, // Land ID
		user1.address, // Owner
		"123 Main St", // Location
		1000, // Area
		"QmXyZ..." // Document hash
	);
	await tx.wait();
	console.log("Land title registered successfully");

	// Get land title details
	console.log("\nFetching land title details...");
	const landTitle = await landRegistry.landTitles(1);
	console.log("Land Title Details:");
	console.log("  Is Registered:", landTitle.isRegistered);
	console.log("  Owner:", landTitle.ownerAddress);
	console.log("  Location:", landTitle.location);
	console.log("  Area:", landTitle.area.toString());
	console.log("  Document Hash:", landTitle.documentHash);
	console.log("  Token ID:", landTitle.tokenId.toString());

	// Check token ownership
	console.log("\nChecking token ownership...");
	const tokenOwner = await titleDeedToken.ownerOf(landTitle.tokenId);
	console.log("Token Owner:", tokenOwner);

	// Get document hash from token
	console.log("\nFetching document hash from token...");
	const docHash = await titleDeedToken.getDocumentHash(landTitle.tokenId);
	console.log("Document Hash from Token:", docHash);

	// Try registering the same land ID (should fail)
	console.log("\nTrying to register the same land ID (should fail)...");
	try {
		await landRegistry.registerLandTitle(
			1, // Same Land ID
			user2.address,
			"Another location",
			500,
			"Different hash"
		);
		console.log("ERROR: Registration succeeded when it should have failed!");
	} catch (error) {
		console.log("Registration failed as expected:", error.message.slice(0, 100) + "...");
	}

	// Try registering with area = 0 (should fail)
	console.log("\nTrying to register with area = 0 (should fail)...");
	try {
		await landRegistry.registerLandTitle(
			2,
			user1.address,
			"456 Second St",
			0, // Invalid area
			"QmAbc..."
		);
		console.log("ERROR: Registration succeeded when it should have failed!");
	} catch (error) {
		console.log("Registration failed as expected:", error.message.slice(0, 100) + "...");
	}

	// Try registering as non-owner (should fail)
	console.log("\nTrying to register as non-owner (should fail)...");
	try {
		await landRegistry.connect(user1).registerLandTitle(
			3,
			user2.address,
			"789 Third St",
			1200,
			"QmDef..."
		);
		console.log("ERROR: Registration succeeded when it should have failed!");
	} catch (error) {
		console.log("Registration failed as expected:", error.message.slice(0, 100) + "...");
	}

	console.log("\nAll test scenarios completed!");
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});