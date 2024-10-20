// hardhat.config.js
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

const endpointUrl = "https://api.developer.coinbase.com/rpc/v1/base-sepolia/exXpF_eTpyjXWiYz3iEU6JGT50NVOQ_9";
const privateKey = "60c786c629d92914b2e284a25707766e86f258fc37079d109aafedcc8df55835";  // Ensure this is kept secret!

module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: endpointUrl,
      accounts: [privateKey],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [privateKey],
    },
  },
};
