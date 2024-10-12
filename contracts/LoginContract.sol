// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "https://github.com/I-Macharia/smart-wallet/blob/main/src/CoinbaseSmartWallet.sol";
import "https://github.com/I-Macharia/smart-wallet/blob/main/src/MultiOwnable.sol";
import "https://github.com/I-Macharia/webauthn-sol/blob/main/src/WebAuthn.sol";
import "./lib/solady/utils/LibString.sol";

contract LoginContract {
    // Mapping of user addresses to registration status
    mapping(address => bool) public isRegistered;

    // Event emitted when a user registers
    event UserRegistered(address indexed userAddress);

    // Function to register a user
    function register() public {
        // Get the BASE smart wallet instance
        BaseSmartWallet smartWallet = BaseSmartWallet(address(this));

        // Register the user using the BASE smart wallet
        smartWallet.register(msg.sender);

        // Emit the UserRegistered event
        emit UserRegistered(msg.sender);

        // Set the user's registration status to true
        isRegistered[msg.sender] = true;
    }

    // Function to check if a user is registered
    function isUserRegistered() public view returns (bool) {
        // Get the BASE smart wallet instance
        BaseSmartWallet smartWallet = BaseSmartWallet(address(this));

        // Check if the user is registered using the BASE smart wallet
        return smartWallet.isRegistered(msg.sender);
    }

    // Function to check if a user is registered
    function isRegistered(address userAddress) public view returns (bool) {
        // Get the BASE smart wallet instance
        BaseSmartWallet smartWallet = BaseSmartWallet(address(this));

        // Check if the user is registered using the BASE smart wallet
        return smartWallet.isRegistered(userAddress);
    }
}