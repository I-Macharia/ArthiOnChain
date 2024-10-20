
# TitleDeedTokenization and LandTitleRegistry Contract

## Overview

This repository contains two Solidity smart contracts that together facilitate the tokenization and registration of land titles on the Base Sepolia testnet using Foundry. These contracts aim to create a decentralized land title registry system where each title deed is represented by a unique token and stored immutably on the blockchain.

### Contracts

1. **TitleDeedTokenization**
   - Manages the minting of unique tokens that represent land title deeds.
   - Each token corresponds to a unique land title document, identified by its hash.

2. **LandTitleRegistry**
   - Maintains a registry of land titles.
   - Allows the government (the contract deployer) to register, update, and manage land titles.
   - Integrates with `TitleDeedTokenization` to mint tokens representing ownership.

## Contract Breakdown

### 1. **TitleDeedTokenization**
   - **State Variables**:
     - `nextTokenId`: Tracks the ID for the next token to be minted.
     - `tokenDocumentHashes`: Maps token IDs to document hashes.

   - **Functions**:
     - `mintToken(address to, string memory documentHash)`: Mints a new token for a given address and links it to the provided document hash.
     - `_exists(uint256 tokenId)`: Internal function to check if a token exists by verifying the existence of a document hash.

   - **Events**:
     - `TokenMinted`: Emitted when a new token is minted, storing the recipient’s address, token ID, and the associated document hash.

### 2. **LandTitleRegistry**
   - **State Variables**:
     - `landTitles`: A mapping of land titles where each entry contains details about the title’s owner, location, area, and associated document hash.
     - `government`: The address of the entity with permission to register and update land titles.
     - `titleDeedTokenization`: An instance of the `TitleDeedTokenization` contract.

   - **Modifiers**:
     - `onlyGovernment`: Restricts specific functions to the deployer, considered as the government.

   - **Functions**:
     - `registerLandTitle`: Allows the government to register a new land title, minting a token to represent ownership.
     - `updateLandDetails`: Updates the land title details, including ownership, location, and area. Also allows minting a new token upon updating.
     - `getLandDetails`: Retrieves land title details by ID.

   - **Events**:
     - `LandTitleUpdated`: Emitted when a land title is updated.
     - `LandTitleNotRegistered`: Emitted if a non-existent land title is accessed.

## Deployment

To deploy this contract on Base Sepolia using Foundry:

1. Ensure you have Foundry installed and initialized in your project.
   ```bash
   forge init
   ```

2. Add the Base Sepolia network to your configuration.

3. Compile the contracts:
   ```bash
   forge build
   ```

4. Deploy the `LandTitleRegistry` contract:
   ```bash
   forge create LandTitleRegistry --rpc-url <SEPOLIA_RPC_URL> --private-key <YOUR_PRIVATE_KEY>
   ```

5. Once deployed, you can interact with the contract using `cast` or through a front-end dapp to register land titles and tokenize them.
   ```
  **Deployer:** 0xBC947b5C75808883eCb0fcdbCFC2832971CB0F47
  **Deployed to:** 0xec7aDb0713aa0C4F4fd9c4b41fEafca7d27ba617
  **Transaction hash:** 0xa5a7950407d95fddf1236e03045385536ace86af09be3b6a39502d24ac565e40
  ```

## License

This project is licensed under the MIT License.
