// src/lib/web3/config.ts
import { ethers } from "ethers";

// Contract ABIs
// Note: Replace these with your actual contract ABIs
export const LandRegistryABI = [
  // Add your Land Registry ABI here
];

export const TitleDeedTokenABI = [
  // Add your Title Deed Token ABI here
];

// Contract addresses for Hedera testnet
export const CONTRACT_ADDRESSES = {
  // Hedera testnet
  "0x296": {
    LandRegistry: "0x123...", // Replace with your actual contract address
    TitleDeedToken: "0x456..." // Replace with your actual contract address
  }
};

// Hedera testnet RPC URL
export const HEDERA_TESTNET_RPC = "https://testnet.hashio.io/api";

// Hedera testnet Chain ID (0x296 or 662 in decimal)
export const HEDERA_TESTNET_CHAIN_ID = "0x296";

// Network configuration for MetaMask
export const HEDERA_TESTNET_CONFIG = {
  chainId: HEDERA_TESTNET_CHAIN_ID,
  chainName: "Hedera Testnet",
  nativeCurrency: {
    name: "HBAR",
    symbol: "HBAR",
    decimals: 18
  },
  rpcUrls: [HEDERA_TESTNET_RPC],
  blockExplorerUrls: ["https://hashscan.io/testnet"]
};