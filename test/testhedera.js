const { Client } = require("@hashgraph/sdk");

async function main() {
  const client = Client.forTestnet();
  console.log("Hedera SDK installed and client initialized successfully!");
}

main();