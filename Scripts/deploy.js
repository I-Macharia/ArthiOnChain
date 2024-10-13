async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const TitleDeedTokenization = await ethers.getContractFactory("TitleDeedTokenization");
    const contract = await TitleDeedTokenization.deploy();
  
    console.log("Contract deployed at:", contract.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });