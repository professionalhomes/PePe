// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./NFTCard.sol";  // Ensure this is the correct path to the NFTCard contract

contract CardPack is ERC721, Ownable, ReentrancyGuard {
    uint256 public currentPackId;
    NFTCard public nftCardContract;
    string[] public cardURIs;

    struct Pack {
        uint256 id;
        bool opened;
    }

    mapping(uint256 => Pack) public packs;

    event PackMinted(uint256 indexed packId);
    event PackOpened(uint256 indexed packId, address indexed owner);
    event CardURIAdded(string cardURI);
    event CardURIRemoved(string cardURI);

    error InvalidIndex();
    error NotPackOwner(uint256 packId);
    error PackAlreadyOpened(uint256 packId);
    error NoCardURIsAvailable();

    constructor(address _nftCardContract, address initialOwner) ERC721("Card Pack", "PACK") Ownable(initialOwner) {
        nftCardContract = NFTCard(_nftCardContract);
    }

    function addCardURI(string memory _cardURI) external onlyOwner {
        cardURIs.push(_cardURI);
        emit CardURIAdded(_cardURI);
    }

    function removeCardURI(uint256 index) external onlyOwner {
        if (index >= cardURIs.length) revert InvalidIndex();
        string memory removedURI = cardURIs[index];
        cardURIs[index] = cardURIs[cardURIs.length - 1];
        cardURIs.pop();
        emit CardURIRemoved(removedURI);
    }

    function getCardURIs() external view returns (string[] memory) {
        return cardURIs;
    }

    function mintPack(address to) external onlyOwner returns (uint256) {
        currentPackId++;
        uint256 newPackId = currentPackId;

        _safeMint(to, newPackId);

        packs[newPackId] = Pack({
            id: newPackId,
            opened: false
        });

        emit PackMinted(newPackId);

        return newPackId;
    }

    function openPack(uint256 packId) external nonReentrant {
        if (ownerOf(packId) != msg.sender) revert NotPackOwner(packId);
        if (packs[packId].opened) revert PackAlreadyOpened(packId);

        packs[packId].opened = true;

        for (uint256 i = 0; i < 7; i++) {
            string memory tokenURI = selectRandomCard();
            (NFTCard.Rarity rarity, string memory ability, uint256 power, uint256 defense) = getCardAttributes(tokenURI);
            nftCardContract.mintCard(msg.sender, tokenURI, rarity, ability, power, defense);
        }

        emit PackOpened(packId, msg.sender);
    }

    function selectRandomCard() internal view returns (string memory) {
        if (cardURIs.length == 0) revert NoCardURIsAvailable();
        uint256 randomIndex = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % cardURIs.length;
        return cardURIs[randomIndex];
    }

    function getCardAttributes(string memory tokenURI) internal pure returns (NFTCard.Rarity, string memory, uint256, uint256) {
        // Dummy implementation - replace with logic to parse the tokenURI and extract attributes
        if (keccak256(abi.encodePacked(tokenURI)) == keccak256(abi.encodePacked("ipfs://legendary-card-cid"))) {
            return (NFTCard.Rarity.Legendary, "Legendary Ability", 10, 8);
        } else if (keccak256(abi.encodePacked(tokenURI)) == keccak256(abi.encodePacked("ipfs://epic-card-cid"))) {
            return (NFTCard.Rarity.Epic, "Epic Ability", 8, 6);
        } else if (keccak256(abi.encodePacked(tokenURI)) == keccak256(abi.encodePacked("ipfs://rare-card-cid"))) {
            return (NFTCard.Rarity.Rare, "Rare Ability", 6, 5);
        } else if (keccak256(abi.encodePacked(tokenURI)) == keccak256(abi.encodePacked("ipfs://uncommon-card-cid"))) {
            return (NFTCard.Rarity.Uncommon, "Uncommon Ability", 5, 4);
        } else {
            return (NFTCard.Rarity.Common, "Common Ability", 4, 3);
        }
    }
}
