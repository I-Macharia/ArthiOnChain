// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Login {
    mapping(address => bool) public isRegistered;

    modifier onlyRegistered() {
        require(isRegistered[msg.sender], "You need to be a registered user");
        _;
    }

    event UserRegistered(address indexed userAddress);

    function register() public {
        require(!isRegistered[msg.sender], "User already registered");
        isRegistered[msg.sender] = true;

        emit UserRegistered(msg.sender);
    }

    function isUserRegistered() public view returns (bool) {
        return isRegistered[msg.sender];
    }
}
