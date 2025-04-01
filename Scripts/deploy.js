// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy TitleDeedToken
  const TitleDeedToken = await ethers.getContractFactory("TitleDeedToken");
  const titleDeedToken = await TitleDeedToken.deploy();
  await titleDeedToken.waitForDeployment();
  console.log("TitleDeedToken deployed to:", await titleDeedToken.getAddress());

  // Deploy LandRegistry
  const LandRegistry = await ethers.getContractFactory("LandRegistry");
  const landRegistry = await LandRegistry.deploy(deployer.address, await titleDeedToken.getAddress());
  await landRegistry.waitForDeployment();
  console.log("LandRegistry deployed to:", await landRegistry.getAddress());

  // Grant MINTER_ROLE to landRegistry
  const MINTER_ROLE = await titleDeedToken.MINTER_ROLE();
  await titleDeedToken.grantRole(MINTER_ROLE, await landRegistry.getAddress());
  console.log("MINTER_ROLE granted to LandRegistry");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });