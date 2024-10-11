// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./LoginContract.sol"; // Import Login contract for authentication
import "./tokenize.sol"; // Import TitleDeedTokenization for minting and burning tokens

contract LandTitleRegistry is TitleDeedTokenization {
    struct LandTitle {
        bool isRegistered;
        address ownerAddress;
        string location;
        uint256 area;
        string documentHash;
    }

    mapping(uint256 => LandTitle) public landTitles;
    address public government;
    Login public loginContract;

    event LandTitleUpdated(uint256 indexed id, address indexed newOwnerAddress, string newLocation, uint256 newArea, string newDocumentHash);

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
        uint256 _area,
        string memory _documentHash
    ) public onlyGovernment onlyRegistered {
        require(!landTitles[_id].isRegistered, "Land title already registered");
        require(_area > 0, "Area must be greater than 0");

        landTitles[_id] = LandTitle({
            isRegistered: true,
            ownerAddress: _ownerAddress,
            location: _location,
            area: _area,
            documentHash: _documentHash
        });

        mintToken(_ownerAddress, _documentHash);
    }

    function updateLandDetails(
        uint256 _id,
        address _newOwnerAddress,
        string memory _newLocation,
        uint256 _newArea,
        string memory _newDocumentHash
    ) public onlyGovernment onlyRegistered {
        require(landTitles[_id].isRegistered, "Land title not registered");
        require(_newArea > 0, "Area must be greater than 0");

        LandTitle storage title = landTitles[_id];
        title.ownerAddress = _newOwnerAddress;
        title.location = _newLocation;
        title.area = _newArea;
        title.documentHash = _newDocumentHash;

        // Update the token document hash
        uint256 tokenId = _id;
        tokenDocumentHashes[tokenId] = _newDocumentHash;

        emit LandTitleUpdated(_id, _newOwnerAddress, _newLocation, _newArea, _newDocumentHash);
    }

    function getLandDetails(uint256 _id) public view returns (
        address ownerAddress,
        string memory location,
        uint256 area,
        string memory documentHash
    ) {
        LandTitle storage title = landTitles[_id];
        require(title.isRegistered, "Land title not registered");
        return (title.ownerAddress, title.location, title.area, title.documentHash);
    }
}