// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/ITitleDeedToken.sol";

contract LandRegistry is Ownable {
    struct LandTitle {
        bool isRegistered;
        address ownerAddress;
        string location;
        uint256 area;
        string documentHash;
        uint256 tokenId;
    }

    ITitleDeedToken public titleDeedToken;
    mapping(uint256 => LandTitle) public landTitles;
    
    event LandTitleRegistered(
        uint256 indexed id,
        address indexed owner,
        string location,
        uint256 area,
        string documentHash,
        uint256 tokenId
    );
    
    constructor(address initialOwner, address _titleDeedToken) Ownable(initialOwner) {
        titleDeedToken = ITitleDeedToken(_titleDeedToken);
    }

    function registerLandTitle(
        uint256 _id,
        address _owner,
        string calldata _location,
        uint256 _area,
        string calldata _documentHash
    ) external onlyOwner {
        require(!landTitles[_id].isRegistered, "Already registered");
        require(_area > 0, "Invalid area");
        
        uint256 tokenId = titleDeedToken.mintToken(_owner, _documentHash);
        
        landTitles[_id] = LandTitle({
            isRegistered: true,
            ownerAddress: _owner,
            location: _location,
            area: _area,
            documentHash: _documentHash,
            tokenId: tokenId
        });
        
        emit LandTitleRegistered(
            _id,
            _owner,
            _location,
            _area,
            _documentHash,
            tokenId
        );
    }
}