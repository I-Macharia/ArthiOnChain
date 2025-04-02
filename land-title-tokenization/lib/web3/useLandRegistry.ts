// src/lib/web3/useLandRegistry.ts
"use client";

import { useState } from "react";
import { useWeb3 } from "./web3Provider";
import { ethers } from "ethers";

interface LandTitle {
  id: string;
  owner: string;
  propertyAddress: string;
  coordinates: string;
  area: number;
  registrationDate: Date;
  titleDeedTokenId: string;
  lastUpdated: Date;
}

export function useLandRegistry() {
  const { landRegistryContract, address, isConnected, isCorrectNetwork } = useWeb3();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Register a new land title
  const registerLandTitle = async (
    propertyAddress: string,
    coordinates: string,
    area: number,
    ownerAddress: string = address || ""
  ) => {
    if (!landRegistryContract || !isConnected || !isCorrectNetwork) {
      setError("Wallet not connected or wrong network");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await landRegistryContract.registerLandTitle(
        ownerAddress,
        propertyAddress,
        coordinates,
        area
      );
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Extract title ID from events (assuming your contract emits an event with the title ID)
      const titleId = extractTitleIdFromReceipt(receipt);
      
      setLoading(false);
      return titleId;
    } catch (err: any) {
      console.error("Error registering land title:", err);
      setError(err.message || "Error registering land title");
      setLoading(false);
      return null;
    }
  };

  // Get a land title by ID
  const getLandTitle = async (titleId: string): Promise<LandTitle | null> => {
    if (!landRegistryContract) {
      setError("Contract not initialized");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const titleData = await landRegistryContract.getLandTitle(titleId);
      
      const landTitle: LandTitle = {
        id: titleId,
        owner: titleData.owner,
        propertyAddress: titleData.propertyAddress,
        coordinates: titleData.coordinates,
        area: Number(titleData.area),
        registrationDate: new Date(Number(titleData.registrationDate) * 1000),
        titleDeedTokenId: titleData.titleDeedTokenId,
        lastUpdated: new Date(Number(titleData.lastUpdated) * 1000)
      };
      
      setLoading(false);
      return landTitle;
    } catch (err: any) {
      console.error("Error getting land title:", err);
      setError(err.message || "Error getting land title");
      setLoading(false);
      return null;
    }
  };

  // Get all land titles
  const getAllLandTitles = async (): Promise<LandTitle[]> => {
    if (!landRegistryContract) {
      setError("Contract not initialized");
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      // Get total number of titles
      const totalTitles = await landRegistryContract.getTotalTitles();
      const titles: LandTitle[] = [];
      
      // Fetch each title
      for (let i = 0; i < totalTitles; i++) {
        const titleId = await landRegistryContract.titleIds(i);
        const title = await getLandTitle(titleId);
        if (title) {
          titles.push(title);
        }
      }
      
      setLoading(false);
      return titles;
    } catch (err: any) {
      console.error("Error getting all land titles:", err);
      setError(err.message || "Error getting all land titles");
      setLoading(false);
      return [];
    }
  };

  // Get titles owned by current user
  const getMyLandTitles = async (): Promise<LandTitle[]> => {
    if (!landRegistryContract || !address) {
      setError("Wallet not connected");
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const myTitleIds = await landRegistryContract.getTitlesByOwner(address);
      const titles: LandTitle[] = [];
      
      // Fetch each title
      for (const titleId of myTitleIds) {
        const title = await getLandTitle(titleId);
        if (title) {
          titles.push(title);
        }
      }
      
      setLoading(false);
      return titles;
    } catch (err: any) {
      console.error("Error getting user land titles:", err);
      setError(err.message || "Error getting user land titles");
      setLoading(false);
      return [];
    }
  };

  // Update land title
  const updateLandTitle = async (
    titleId: string,
    propertyAddress: string,
    coordinates: string,
    area: number
  ) => {
    if (!landRegistryContract || !isConnected || !isCorrectNetwork) {
      setError("Wallet not connected or wrong network");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await landRegistryContract.updateLandTitle(
        titleId,
        propertyAddress,
        coordinates,
        area
      );
      
      // Wait for transaction to be mined
      await tx.wait();
      
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error("Error updating land title:", err);
      setError(err.message || "Error updating land title");
      setLoading(false);
      return false;
    }
  };

  // Transfer land title ownership
  const transferLandTitle = async (titleId: string, newOwner: string) => {
    if (!landRegistryContract || !isConnected || !isCorrectNetwork) {
      setError("Wallet not connected or wrong network");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const tx = await landRegistryContract.transferLandTitle(titleId, newOwner);
      
      // Wait for transaction to be mined
      await tx.wait();
      
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error("Error transferring land title:", err);
      setError(err.message || "Error transferring land title");
      setLoading(false);
      return false;
    }
  };

  // Helper function to extract title ID from transaction receipt
  const extractTitleIdFromReceipt = (receipt: any) => {
    // This is a placeholder - you'll need to adjust based on your contract's events
    const titleRegisteredEvent = receipt.events?.find(
      (e: any) => e.event === "TitleRegistered"
    );
    
    return titleRegisteredEvent?.args?.titleId || "";
  };

  return {
    registerLandTitle,
    getLandTitle,
    getAllLandTitles,
    getMyLandTitles,
    updateLandTitle,
    transferLandTitle,
    loading,
    error
  };
}