// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TitleDeedTokenization {
    uint256 public nextTokenId;
    mapping(uint256 => string) public tokenDocumentHashes;
    
    // Events
    event TokenMinted(address indexed to, uint256 indexed tokenId, string documentHash);

    // Function to mint a new token for a land title
    function mintToken(address to, string memory documentHash) public {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        
        // Emit token minted event
        emit TokenMinted(to, tokenId, documentHash);
        tokenDocumentHashes[tokenId] = documentHash;
    }
    
    // Function to check if a token exists (for demonstration)
    function _exists(uint256 tokenId) internal view returns (bool) {
        return bytes(tokenDocumentHashes[tokenId]).length > 0;
    }
}

contract LandTitleRegistry {
    // Struct to store land title information
    struct LandTitle {
        bool isRegistered;
        address ownerAddress;
        string location;
        uint256 area;
        string documentHash;
    }

    // Mapping to store land titles
    mapping(uint256 => LandTitle) public landTitles;

    // Event to notify of land title updates
    event LandTitleUpdated(uint256 indexed id, address indexed newOwnerAddress, string newLocation, uint256 newArea, string newDocumentHash);
    event LandTitleNotRegistered(uint256 indexed id);

    // Address of the government
    address public government;

    // Instance of TitleDeedTokenization contract
    TitleDeedTokenization public titleDeedTokenization;

    // Constructor to set government address
    constructor() {
        government = msg.sender;
        titleDeedTokenization = new TitleDeedTokenization(); // Instantiate TitleDeedTokenization
    }

    // Modifier to restrict functions to only the government
    modifier onlyGovernment {
        require(msg.sender == government, "Only the government can call this function");
        _;
    }

    // Function to register a land title
    function registerLandTitle(
        uint256 _id,
        address _ownerAddress,
        string memory _location,
        uint256 _area,
        string memory _documentHash
    ) public onlyGovernment {
        require(!landTitles[_id].isRegistered, "Land title already registered");
        require(_area > 0, "Area must be greater than 0");

        landTitles[_id] = LandTitle({
            isRegistered: true,
            ownerAddress: _ownerAddress,
            location: _location,
            area: _area,
            documentHash: _documentHash
        });

        // Mint a new token for the registered land title
        titleDeedTokenization.mintToken(_ownerAddress, _documentHash);
    }

    // Function to update land title details
    function updateLandDetails(
        uint256 _id,
        address _newOwnerAddress,
        string memory _newLocation,
        uint256 _newArea,
        string memory _newDocumentHash
    ) public onlyGovernment {
        require(landTitles[_id].isRegistered, "Land title not registered");
        require(_newArea > 0, "Area must be greater than 0");

        LandTitle storage title = landTitles[_id];
        title.ownerAddress = _newOwnerAddress;
        title.location = _newLocation;
        title.area = _newArea;
        title.documentHash = _newDocumentHash;

        emit LandTitleUpdated(_id, _newOwnerAddress, _newLocation, _newArea, _newDocumentHash);

        // Optionally, you can also mint a new token for updates
        titleDeedTokenization.mintToken(_newOwnerAddress, _newDocumentHash);
    }

    // Function to get land title details
    function getLandDetails(uint256 _id) public view returns (
        bool isRegistered,
        address ownerAddress,
        string memory location,
        uint256 area,
        string memory documentHash
    ) {
        LandTitle storage title = landTitles[_id];
        require(title.isRegistered, "Land title not registered");

        return (title.isRegistered, title.ownerAddress, title.location, title.area, title.documentHash);
    }
}