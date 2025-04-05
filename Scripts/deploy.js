require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  FileCreateTransaction,
  ContractCreateTransaction,
  Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

async function main() {
  // Load Hedera credentials from .env
  const MY_ACCOUNT_ID = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY);

  // Initialize Hedera client
  const client = Client.forTestnet().setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

  console.log("Deploying contracts with account:", MY_ACCOUNT_ID.toString());

  // Deploy TitleDeedTokenization contract
  const titleDeedTokenContractId = await deployContract(
    client,
    "./artifacts/contracts/TitleDeedTokenization.sol/TitleDeedTokenization.json",
    "TitleDeedTokenization"
  );

  // Deploy LandTitleRegistry contract
  const landRegistryContractId = await deployContract(
    client,
    "./artifacts/contracts/LandTitleRegistry.sol/LandTitleRegistry.json",
    "LandTitleRegistry"
  );

  // Output deployed contract IDs
  console.log({
    titleDeedTokenContractId: titleDeedTokenContractId.toString(),
    landRegistryContractId: landRegistryContractId.toString(),
  });
}

async function deployContract(client, artifactPath, contractName) {
  console.log(`\nDeploying ${contractName}...`);

  // Read the compiled bytecode
  const contractBytecode = fs.readFileSync(artifactPath);
  const contractBinary = JSON.parse(contractBytecode).bytecode;

  // Upload the bytecode to Hedera
  const fileTx = await new FileCreateTransaction()
    .setContents(Buffer.from(contractBinary, "hex"))
    .setKeys([client.operatorPublicKey])
    .setMaxTransactionFee(new Hbar(2))
    .execute(client);

  const fileReceipt = await fileTx.getReceipt(client);
  const bytecodeFileId = fileReceipt.fileId;
  console.log(`${contractName} bytecode file uploaded with ID:`, bytecodeFileId);

  // Deploy the contract
  const contractTx = await new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(2000000)
    .execute(client);

  const contractReceipt = await contractTx.getReceipt(client);
  const contractId = contractReceipt.contractId;
  console.log(`${contractName} deployed with ID:`, contractId);

  return contractId;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });