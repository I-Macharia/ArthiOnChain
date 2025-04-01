// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/ITitleDeedToken.sol";

contract TitleDeedToken is ERC721, AccessControl, ITitleDeedToken {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 private _nextTokenId;
    mapping(uint256 => string) private _documentHashes;

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
    
    constructor() ERC721("TitleDeed", "DEED") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    function mintToken(address to, string memory documentHash) 
        external 
        onlyRole(MINTER_ROLE) 
        returns (uint256)
    {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _documentHashes[tokenId] = documentHash;
        emit TokenMinted(to, tokenId, documentHash);
        return tokenId;
    }
    
    function getDocumentHash(uint256 tokenId) 
        external 
        view 
        returns (string memory)
    {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return _documentHashes[tokenId];
    }
}