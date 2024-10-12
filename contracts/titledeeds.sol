// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LoginContract.sol"; // Import Login contract for authentication
import "./tokenize.sol"; // Import TitleDeedTokenization for minting and burning tokens

contract LandTitleRegistry is TitleDeedTokenization {
    struct LandTitle {
        bool isRegistered;
        address ownerAddress;
        string location;
        string area;
        string documentHash;
    }

    mapping(uint256 => LandTitle) public landTitles;
    address public government;
    Login public loginContract;

    event LandTitleUpdated(uint256 indexed id, address indexed newOwnerAddress, string newLocation, string newArea, string newDocumentHash);

    constructor(address _loginContract, address initialOwner) TitleDeedTokenization(initialOwner) {
        government = msg.sender;
        loginContract = Login(_loginContract);
    }

    modifier onlyGovernment() {
        require(msg.sender == government, "Only the government can call this function");
        _;
    }

    modifier onlyRegistered() {
        require(loginContract.isUserRegistered(), "You need to be a registered user");
        _;
    }

    function registerLandTitle(
        uint256 _id,
        address _ownerAddress,
        string memory _location,
        string memory _area
    ) public onlyGovernment onlyRegistered {
        require(!landTitles[_id].isRegistered, "Land title already registered");
        require(bytes(_area).length > 0, "Area cannot be empty");

        // Generate a random document hash
        string memory _documentHash = generateDocumentHash();

        landTitles[_id] = LandTitle({
            isRegistered: true,
            ownerAddress: _ownerAddress,
            location: _location,
            area: _area,
            documentHash: _documentHash
        });

        // Mint a token for the land title
        mintToken(_ownerAddress, _documentHash);
    }

    function generateDocumentHash() internal view returns (string memory) {
        // Generate a random document hash (e.g., using a hash function)
        // For demonstration purposes, we'll use a simple random number
        uint256 randomNum = uint256(keccak256(abi.encodePacked(block.timestamp)));
        return toString(randomNum);
    }

    function toString(uint256 value) internal pure returns (string memory) {
        // Convert uint256 to string
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}