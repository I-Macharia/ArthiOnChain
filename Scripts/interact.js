require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  ContractExecuteTransaction,
  ContractCallQuery,
  Hbar,
} = require("@hashgraph/sdk");

async function main() {
  // Load Hedera credentials from .env
  const MY_ACCOUNT_ID = AccountId.fromString(process.env.HEDERA_ACCOUNT_ID);
  const MY_PRIVATE_KEY = PrivateKey.fromStringECDSA(process.env.HEDERA_PRIVATE_KEY);

  // Initialize Hedera client
  const client = Client.forTestnet().setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

  // Replace with your deployed contract IDs
  const titleDeedTokenContractId = "0.0.xxxx";
  const landRegistryContractId = "0.0.yyyy";

  // Example: Call a function on the LandTitleRegistry contract
  const functionName = "registerLandTitle";
  const params = [
    1, // Title ID
    "0x123...", // Owner address
    "123 Main St", // Location
    1000, // Area
    "QmXyZ...", // Document hash
  ];

  const tx = await new ContractExecuteTransaction()
    .setContractId(landRegistryContractId)
    .setGas(100000)
    .setFunction(functionName, params)
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