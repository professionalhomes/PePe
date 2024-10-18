// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTCard is ERC721, Ownable, ReentrancyGuard {
    uint256 public currentTokenId;
    address public cardPackContract;

    enum Rarity { Common, Uncommon, Rare, Epic, Legendary }

    struct Card {
        uint256 id;
        Rarity rarity;
        string ability;
        uint256 power;
        uint256 defense;
    }

    mapping(uint256 => Card) public cards;
    mapping(uint256 => string) private _tokenURIs;

    event CardMinted(uint256 indexed tokenId, Rarity rarity, string ability, uint256 power, uint256 defense);

    error UnauthorizedMinter();

    constructor(string memory name, string memory symbol) 
        ERC721(name, symbol)
        Ownable(msg.sender)
    {
        currentTokenId = 0;
    }

    modifier onlyMinter() {
        if (msg.sender != owner() && msg.sender != cardPackContract) revert UnauthorizedMinter();
        _;
    }

    function setCardPackContract(address _cardPackContract) external onlyOwner {
        cardPackContract = _cardPackContract;
    }

    function mintCard(
        address to,
        string memory _tokenURI,
        Rarity cardRarity,
        string memory ability,
        uint256 power,
        uint256 defense
    ) external onlyMinter nonReentrant returns (uint256) {
        currentTokenId++;
        uint256 newTokenId = currentTokenId;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        cards[newTokenId] = Card({
            id: newTokenId,
            rarity: cardRarity,
            ability: ability,
            power: power,
            defense: defense
        });

        emit CardMinted(newTokenId, cardRarity, ability, power, defense);

        return newTokenId;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        if (_ownerOf(tokenId) == address(0)) {
            revert ERC721NonexistentToken(tokenId);
        }
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        return super.tokenURI(tokenId);
    }

    function getCardDetails(uint256 tokenId) external view returns (Card memory) {
        _requireOwned(tokenId);
        return cards[tokenId];
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "";
    }
}