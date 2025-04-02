// src/lib/web3/useTitleDeedToken.ts
"use client";

import { useState } from "react";
import { useWeb3 } from "./web3Provider";
import { ethers } from "ethers";

interface TitleDeedMetadata {
  titleId: string;
  propertyAddress: string;
  coordinates: string;
  area: number;
  registrationDate: Date;
  uri: string;
}

export function useTitleDeedToken() {
  const { titleDeedContract, address, isConnected, isCorrectNetwork } = useWeb3();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Get token URI
  const getTokenURI = async (tokenId: string): Promise<string | null> => {
    if (!titleDeedContract) {
      setError("Contract not initialized");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const uri = await titleDeedContract.tokenURI(tokenId);
      setLoading(false);
      return uri;
    } catch (err: any) {
      console.error("Error getting token URI:", err);
      setError(err.message || "Error getting token URI");
      setLoading(false);
      return null;
    }
  };

  // Get title deed metadata
  const getTitleDeedMetadata = async (tokenId: string): Promise<TitleDeedMetadata | null> => {
    if (!titleDeedContract) {
      setError("Contract not initialized");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const uri = await getTokenURI(tokenId);
      
      if (!uri) {
        setError("Token URI not found");
        setLoading(false);
        return null;
      }
      
      // Fetch metadata from URI (assuming it's a JSON file)
      const response = await fetch(uri);
      const metadata = await response.json();
      
      setLoading(false);
      return {
        titleId: metadata.titleId,
        propertyAddress: metadata.propertyAddress,
        coordinates: metadata.coordinates,
        area: metadata.area,
        registrationDate: new Date(metadata.registrationDate * 1000),
        uri
      };
    } catch (err: any) {
      console.error("Error getting token metadata:", err);
      setError(err.message || "Error getting token metadata");
      setLoading(false);
      return null;
    }
  };

  // Get all tokens owned by current user
  const getMyTokens = async (): Promise<string[]> => {
    if (!titleDeedContract || !address) {
      setError("Wallet not connected");
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const balance = await titleDeedContract.balanceOf(address);
      const tokenIds: string[] = [];
      
      // Get all token IDs owned by the user
      for (let i = 0; i < balance; i++) {
        const tokenId = await titleDeedContract.tokenOfOwnerByIndex(address, i);
        tokenIds.push(tokenId.toString());
      }
      
      setLoading(false);
      return tokenIds;
    } catch (err: any) {
      console.error("Error getting user tokens:", err);
      setError(err.message || "Error getting user tokens");
      setLoading(false);
      return [];
    }
  };

  return {
    getTokenURI,
    getTitleDeedMetadata,
    getMyTokens,
    loading,
    error
  };
}