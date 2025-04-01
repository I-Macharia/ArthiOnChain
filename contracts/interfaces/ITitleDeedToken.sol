// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

interface ITitleDeedToken {
    event TokenMinted(address indexed to, uint256 indexed tokenId, string documentHash);
    
    function mintToken(address to, string memory documentHash) external returns (uint256);
    function getDocumentHash(uint256 tokenId) external view returns (string memory);
}