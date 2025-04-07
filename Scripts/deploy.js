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
const path = require("path");

async function main() {
  const MY_ACCOUNT_ID = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY);
  const client = Client.forTestnet().setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

  console.log("Deploying contracts with account:", MY_ACCOUNT_ID.toString());

  // Get bytecode from JSON file
  const artifactPath = path.join(__dirname, "../artifacts/contracts/TitleDeedToken.sol/TitleDeedToken.json");
  const contractJson = require(artifactPath);
  const {bytecode} = contractJson;

  if (!bytecode) {
    throw new Error("Bytecode not found in artifact");
  }

  console.log("Creating file for contract bytecode...");
  const fileCreateTx = new FileCreateTransaction()
    .setKeys([MY_PRIVATE_KEY.publicKey])
    .setContents(bytecode)
    .setMaxTransactionFee(new Hbar(2))
    .freezeWith(client);

  const fileCreateSign = await fileCreateTx.sign(MY_PRIVATE_KEY);
  const fileCreateSubmit = await fileCreateSign.execute(client);
  const fileCreateRx = await fileCreateSubmit.getReceipt(client);
  const bytecodeFileId = fileCreateRx.fileId;
  console.log(`- The bytecode file ID is: ${bytecodeFileId}`);

  // Deploy the contract
  console.log("Deploying contract...");
  const contractCreateTx = new ContractCreateTransaction()
    .setBytecodeFileId(bytecodeFileId)
    .setGas(2000000)
    .setMaxTransactionFee(new Hbar(20))
    .freezeWith(client);

  const contractCreateSign = await contractCreateTx.sign(MY_PRIVATE_KEY);
  const contractCreateSubmit = await contractCreateSign.execute(client);
  const contractCreateRx = await contractCreateSubmit.getReceipt(client);
  const contractId = contractCreateRx.contractId;

  console.log(`- The contract ID is: ${contractId}`);

  // Store contract ID
  const deploymentInfo = {
    contractId: contractId.toString(),
    bytecodeFileId: bytecodeFileId.toString()
  };

  fs.writeFileSync(
    path.join(__dirname, '../.contractIds.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });