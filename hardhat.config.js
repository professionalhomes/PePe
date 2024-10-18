// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

console.log('INFURA_API_URL_TEST:', process.env.INFURA_API_URL_TEST);
console.log('INFURA_API_URL:', process.env.INFURA_API_URL);
console.log('PRIVATE_KEY:', process.env.PRIVATE_KEY);


module.exports = {
  solidity: '0.8.21',
  networks: {
    blastsepolia: {
      url: process.env.INFURA_API_URL_TEST,
      chainId: 168587773,
      accounts: [process.env.PRIVATE_KEY],
    },
    blasts: {
      url: process.env.INFURA_API_URL,
      chainId: 81457,
      accounts: [process.env.PRIVATE_KEY],
    },

    localhost: {
      url: 'http://127.0.0.1:8545',
    },
  },
};

