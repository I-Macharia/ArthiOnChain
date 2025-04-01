# Land Title Tokenization System

## Overview

This repository contains smart contracts that facilitate the tokenization and registration of land titles on the Hedera testnet. The system enables secure and immutable storage of land ownership records using the Hedera Token Service (HTS) and Hedera Consensus Service (HCS). The contracts aim to create a decentralized land title registry system where each title deed is represented by a unique token and stored immutably on the blockchain.

### Core Components

1. **TitleDeedTokenization**
   - Manages the minting of unique tokens that represent land title deeds.
   - Each token corresponds to a unique land title document, identified by its hash.
   - **Core Functions**:
     - `mintToken(address to, string memory documentHash)`: Mints a new token for a given address and links it to the provided document hash.
     - `_exists(uint256 tokenId)`: Internal function to check if a token exists by verifying the existence of a document hash.

2. **LandTitleRegistry**
   - Maintains a registry of land titles.
   - Allows the government (the contract deployer) to register, update, and manage land titles.
   - Integrates with `TitleDeedTokenization` to mint tokens representing ownership.
   - **State Variables**:
     - `landTitles`: A mapping of land titles where each entry contains details about the title’s owner, location, area, and associated document hash.
     - `government`: The address of the entity with permission to register and update land titles.
     - `titleDeedTokenization`: An instance of the `TitleDeedTokenization` contract.
   - **Core Functions**:
     - `registerLandTitle`: Allows the government to register a new land title, minting a token to represent ownership.
     - `updateLandDetails`: Updates the land title details, including ownership, location, and area. Also allows minting a new token upon updating.
     - `getLandDetails`: Retrieves land title details by ID.

## Technical Implementation

### Smart Contracts
- Written in Solidity ^0.8.0
- Leverages Hedera Token Service (HTS) for tokenization and HCS for immutable record keeping.
- Implements ERC721 token standard for representing land titles as unique tokens.

### Development Tools
- **Hardhat** for contract development & testing.
- **Next.js** for frontend development.
- **hashgraph/sdk** for Hedera interactions.
- **Tailwind CSS** for styling.

## Deployment

To deploy the contracts on the Hedera testnet using Hardhat:

1. Ensure you have Hardhat installed and initialized in your project.
   ```bash
   npx hardhat init
   ```

2. Install dependencies:
    ```bash
    npm install
   ```
3. Configure the `hardhat.config.js` file to include the Hedera testnet settings:
    Configure Hedera testnet credentials:
      ```Add HEDERA_ACCOUNT_ID and HEDERA_PRIVATE_KEY to your .env file.```

3. Compile the contracts:
   ```bash
   forge build
   ```

4. Deploy the `LandTitleRegistry` contract:
   ```bash
   npx hardhat run scripts/deploy.js --network hedera-testnet
   ```

5. Once deployed, you can interact with the contract using the frontend or through scripts.
   ```
  **Deployer:**  `0xBC947b5C75808883eCb0fcdbCFC2832971CB0F47`
  **Deployed to:** `0xec7aDb0713aa0C4F4fd9c4b41fEafca7d27ba617`
  **Transaction hash:** `0xa5a7950407d95fddf1236e03045385536ace86af09be3b6a39502d24ac565e40`
  ```

## License

This project is licensed under the MIT License.
