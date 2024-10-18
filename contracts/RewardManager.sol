// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./NFTCard.sol";  // Ensure the path is correct

contract RewardManager is Ownable, ReentrancyGuard {
    NFTCard public nftCardContract;

    event RewardGranted(address indexed player, uint256 indexed tokenId, string tokenURI);

    error Unauthorized();
    error InvalidRewardCriteria();

    // Constructor to initialize the NFTCard contract and set the initial owner
    constructor(address _nftCardContract, address initialOwner) Ownable(initialOwner) {
        nftCardContract = NFTCard(_nftCardContract);
    }

    // Function to grant a reward card to a player
    function grantReward(
        address player, 
        string memory tokenURI, 
        NFTCard.Rarity rarity, 
        string memory ability, 
        uint256 power, 
        uint256 defense
    ) public onlyOwner nonReentrant {
        // Mint the card using NFTCard's mint function
        uint256 tokenId = nftCardContract.mintCard(player, tokenURI, rarity, ability, power, defense);
        emit RewardGranted(player, tokenId, tokenURI);
    }

    // Function to set the NFTCard contract address, in case it changes
    function setNFTCardContract(address _nftCardContract) external onlyOwner {
        nftCardContract = NFTCard(_nftCardContract);
    }

    // Example: Function to reward a player after a specific game achievement
    function rewardForAchievement(address player, uint achievementLevel) external onlyOwner {
        // Logic for rewarding based on achievementLevel
        if (achievementLevel == 1) {
            // Reward a common card
            grantReward(player, "ipfs://common-card-cid", NFTCard.Rarity.Common, "Common Ability", 4, 3);
        } else if (achievementLevel == 2) {
            // Reward an uncommon card
            grantReward(player, "ipfs://uncommon-card-cid", NFTCard.Rarity.Uncommon, "Uncommon Ability", 5, 4);
        } else if (achievementLevel == 3) {
            // Reward a rare card
            grantReward(player, "ipfs://rare-card-cid", NFTCard.Rarity.Rare, "Rare Ability", 6, 5);
        } else if (achievementLevel == 4) {
            // Reward an epic card
            grantReward(player, "ipfs://epic-card-cid", NFTCard.Rarity.Epic, "Epic Ability", 8, 6);
        } else if (achievementLevel >= 5) {
            // Reward a legendary card
            grantReward(player, "ipfs://legendary-card-cid", NFTCard.Rarity.Legendary, "Legendary Ability", 10, 8);
        } else {
            revert InvalidRewardCriteria();
        }
    }
}
