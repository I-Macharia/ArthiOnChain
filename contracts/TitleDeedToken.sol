// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/ITitleDeedToken.sol";

contract TitleDeedToken is ERC721, AccessControl, ITitleDeedToken {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 private _nextTokenId;
    mapping(uint256 => string) private _documentHashes;
    
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
        require(_exists(tokenId), "Token does not exist");
        return _documentHashes[tokenId];
    }
}