require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Check if the private key exists before using it
const privateKey = process.env.HEDERA_PRIVATE_KEY;
if (!privateKey) {
  throw new Error("HEDERA_PRIVATE_KEY is not defined in the environment variables");
}

module.exports = {
  solidity: "0.8.26",
  networks: {
    "hedera-testnet": {
      url: process.env.HEDERA_TESTNET_RPC || "https://testnet.hashio.io/api",
      accounts: [privateKey.toString()],
      chainId: 296
    }
  }
};