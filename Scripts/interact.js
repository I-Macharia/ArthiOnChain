require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  ContractExecuteTransaction,
  ContractCallQuery,
  Hbar,
} = require("@hashgraph/sdk");
const fs = require("fs");

async function main() {
  // Load contract IDs
  const contractIds = JSON.parse(fs.readFileSync('.contractIds.json'));
  const titleDeedTokenContractId = contractIds.titleDeedToken;

  // Load Hedera credentials from .env
  const MY_ACCOUNT_ID = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY);

  // Initialize Hedera client
  const client = Client.forTestnet().setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

  // Example interaction with valid contract ID
  const tx = await new ContractExecuteTransaction()
    .setContractId(titleDeedTokenContractId)
    .setGas(100000)
    .setFunction("name", [])
    .execute(client);

  const receipt = await tx.getReceipt(client);
  console.log(`Transaction status: ${receipt.status}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during interaction:", error);
    process.exit(1);
  });