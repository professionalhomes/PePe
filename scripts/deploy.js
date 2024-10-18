const hre = require('hardhat');

async function main() {
  // Deploy the NFTCard contract
  const NFTCard = await hre.ethers.getContractFactory('NFTCard');
  const nftCard = await NFTCard.deploy('NFT Card', 'NFTC'); // Adjust the name and symbol as needed
  await nftCard.waitForDeployment();
  console.log('NFTCard deployed to:', await nftCard.getAddress());

  // Deploy the CardPack contract
  const CardPack = await hre.ethers.getContractFactory('CardPack');
  const [deployer] = await hre.ethers.getSigners();
  const cardPack = await CardPack.deploy(await nftCard.getAddress(), deployer.address);
  await cardPack.waitForDeployment();
  console.log('CardPack deployed to:', await cardPack.getAddress());

  // Set the CardPack contract as the minter in the NFTCard contract
  await nftCard.setCardPackContract(await cardPack.getAddress());
  console.log('CardPack contract set as minter for NFTCard');
}

// Execute the main function and handle errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});