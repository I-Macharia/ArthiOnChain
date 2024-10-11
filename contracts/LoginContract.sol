// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Login {
    mapping(address => bool) public isRegistered;
    address public connectedWallet;

    event UserRegistered(address indexed userAddress);

    constructor() {
        connectedWallet = address(0); // Initialize connected wallet address to 0
    }

    function connectWallet(address _walletAddress) public {
        connectedWallet = _walletAddress;
    }

    function register() public {
        require(!isRegistered[connectedWallet], "User  already registered");
        isRegistered[connectedWallet] = true;

        emit UserRegistered(connectedWallet);
    }

    function isUserRegistered() public view returns (bool) {
        return isRegistered[connectedWallet];
    }
}