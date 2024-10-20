// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TitleDeedTokenization is ERC721, Ownable {
    uint256 public nextTokenId;
    mapping(uint256 => string) public tokenDocumentHashes;
    address public connectedWallet;

    constructor(address initialOwner) ERC721("TitleDeedToken", "TDT") Ownable(initialOwner) {
        // Initialize the Ownable contract with the initialOwner address
    }

    function connectWallet(address _walletAddress) public {
        connectedWallet = _walletAddress;
    }

    // Function to mint a new token for a land title
    function mintToken(address to, string memory documentHash) public onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _mint(to, tokenId);
        tokenDocumentHashes[tokenId] = documentHash;
    }

        // Function to check if a token exists
    function tokenExists(uint256 tokenId) public view returns (bool) {
        return ERC721.ownerOf(tokenId) != address(0);
    }

    // Function to get the document hash of a token
    function getDocumentHash(uint256 tokenId) public view returns (string memory) {
        require(tokenExists(tokenId), "Token does not exist"); 
        return tokenDocumentHashes[tokenId];
    }

    // Function to burn a token
    function burnToken(uint256 tokenId) public onlyOwner {
        require(tokenExists(tokenId), "Token does not exist"); 
        _burn(tokenId);
        delete tokenDocumentHashes[tokenId];
    }
}