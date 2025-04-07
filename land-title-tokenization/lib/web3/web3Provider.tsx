// src/lib/web3/Web3Provider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import {
    CONTRACT_ADDRESSES,
    LandRegistryABI,
    TitleDeedTokenABI,
    HEDERA_TESTNET_CHAIN_ID,
    HEDERA_TESTNET_CONFIG
} from "./config";

interface Web3ContextType {
    provider: ethers.BrowserProvider | null;
    signer: ethers.JsonRpcSigner | null;
    address: string | null;
    chainId: string | null;
    landRegistryContract: ethers.Contract | null;
    titleDeedContract: ethers.Contract | null;
    isConnected: boolean;
    isCorrectNetwork: boolean;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => void;
    switchToHederaTestnet: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType>({
    provider: null,
    signer: null,
    address: null,
    chainId: null,
    landRegistryContract: null,
    titleDeedContract: null,
    isConnected: false,
    isCorrectNetwork: false,
    connectWallet: async () => { },
    disconnectWallet: () => { },
    switchToHederaTestnet: async () => { }
});

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
    children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);
    const [landRegistryContract, setLandRegistryContract] = useState<ethers.Contract | null>(null);
    const [titleDeedContract, setTitleDeedContract] = useState<ethers.Contract | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean>(false);

    // Initialize provider from window.ethereum
    useEffect(() => {
        const initProvider = async () => {
            if ((window as any).ethereum) {
                try {
                    const provider = new ethers.BrowserProvider((window as any).ethereum);
                    setProvider(provider);

                    // Listen for account changes
                    (window as any).ethereum.on("accountsChanged", handleAccountsChanged);

                    // Listen for chain changes
                    (window as any).ethereum.on("chainChanged", (chainId: string) => {
                        window.location.reload();
                    });

                    // Check if already connected
                    const accounts = await provider.listAccounts();
                    if (accounts.length > 0) {
                        await handleAccountsChanged(accounts.map(account => account.address));
                    }
                } catch (error) {
                    console.error("Error initializing provider:", error);
                }
            }
        };

        initProvider();

        return () => {
            // Cleanup listeners
            if ((window as any).ethereum) {
                (window as any).ethereum.removeListener("accountsChanged", handleAccountsChanged);
            }
        };
    }, []);

    // Update state when account changes
    const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
            // User disconnected
            setAddress(null);
            setSigner(null);
            setLandRegistryContract(null);
            setTitleDeedContract(null);
            setIsConnected(false);
        } else {
            if (!provider) return;

            // Get network and set chain ID
            const network = await provider.getNetwork();
            const chainIdHex = "0x" + network.chainId.toString(16);
            setChainId(chainIdHex);

            // Check if on correct network
            const correctNetwork = chainIdHex === HEDERA_TESTNET_CHAIN_ID;
            setIsCorrectNetwork(correctNetwork);

            // Set user address and signer
            setAddress(accounts[0]);
            const signer = await provider.getSigner();
            setSigner(signer);
            setIsConnected(true);

            // Initialize contracts if on correct network
            if (correctNetwork) {
                initContracts(provider, signer);
            }
        }
    };

    // Initialize smart contracts
    const initContracts = (provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner) => {
        try {
            const addresses = CONTRACT_ADDRESSES[HEDERA_TESTNET_CHAIN_ID];

            const landRegistry = new ethers.Contract(
                addresses.LandRegistry,
                LandRegistryABI,
                signer
            );
            setLandRegistryContract(landRegistry);

            const titleDeed = new ethers.Contract(
                addresses.TitleDeedToken,
                TitleDeedTokenABI,
                signer
            );
            setTitleDeedContract(titleDeed);
        } catch (error) {
            console.error("Error initializing contracts:", error);
        }
    };

    // Connect wallet
    const connectWallet = async () => {
        if (!provider) {
            alert("Please install MetaMask!");
            return;
        }

        try {
            // Request account access
            const accounts = await (window as any).ethereum.request({
                method: "eth_requestAccounts"
            });

            // Update state based on accounts
            await handleAccountsChanged(accounts);

            // Check network and switch if needed
            if (chainId !== HEDERA_TESTNET_CHAIN_ID) {
                await switchToHederaTestnet();
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
        }
    };

    // Disconnect wallet (for UI purposes only, doesn't actually disconnect MetaMask)
    const disconnectWallet = () => {
        setAddress(null);
        setSigner(null);
        setLandRegistryContract(null);
        setTitleDeedContract(null);
        setIsConnected(false);
    };

    // Switch to Hedera testnet
    const switchToHederaTestnet = async () => {
        if (!(window as any).ethereum) {
            return;
        }

        try {
            // Try to switch to Hedera Testnet
            (window as any).ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: HEDERA_TESTNET_CHAIN_ID }]
            });
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await (window as any).ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [HEDERA_TESTNET_CONFIG]
                    });
                } catch (addError) {
                    console.error("Error adding Hedera Testnet:", addError);
                }
            } else {
                console.error("Error switching to Hedera Testnet:", switchError);
            }
        }
    };

    return (
        <Web3Context.Provider
            value={{
                provider,
                signer,
                address,
                chainId,
                landRegistryContract,
                titleDeedContract,
                isConnected,
                isCorrectNetwork,
                connectWallet,
                disconnectWallet,
                switchToHederaTestnet
            }}
        >
            {children}
        </Web3Context.Provider>
    );
};