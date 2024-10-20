// Initialize Coinbase Wallet SDK
const sdk = new CoinbaseWalletSDK({appName: "ArdhiOnchain", appChainIds: [84532]});

//  Make web3 provider
const provider = sdk.makeWeb3Provider();

//  Initialize wallet connection
const addresses = provider.request("eth_requestAccounts");