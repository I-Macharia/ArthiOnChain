// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Login {
    // Mapping to track if a user is registered
    mapping(address => bool) public isRegistered;

    // Event to notify when a user is registered
    event UserRegistered(address indexed userAddress);

    // Event to notify when a user is already registered
    event UserAlreadyRegistered(address indexed userAddress);

    // Function to register a user
    function register() public {
        require(!isRegistered[msg.sender], "User already registered");
        isRegistered[msg.sender] = true;

        emit UserRegistered(msg.sender);
    }

    // Function to verify if the caller is registered
    function isUserRegistered() public view returns (bool) {
        return isRegistered[msg.sender];
    }
}