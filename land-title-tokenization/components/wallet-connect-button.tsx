// src/components/wallet-connect-button.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/lib/web3/web3Provider";
import { useEffect, useState } from "react";

export function WalletConnectButton() {
  const { connectWallet, disconnectWallet, isConnected, address, isCorrectNetwork, switchToHederaTestnet } = useWeb3();
  const [displayAddress, setDisplayAddress] = useState<string>("");

  useEffect(() => {
    if (address) {
      setDisplayAddress(
        `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      );
    }
  }, [address]);

  return (
    <>
      {!isConnected ? (
        <Button
          variant="outline"
          size="sm"
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
      ) : !isCorrectNetwork ? (
        <Button
          variant="destructive"
          size="sm"
          onClick={switchToHederaTestnet}
        >
          Switch to Hedera
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={disconnectWallet}
        >
          {displayAddress}
        </Button>
      )}
    </>
  );
}
