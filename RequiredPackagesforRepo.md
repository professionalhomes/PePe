# Step 1: Install Node.js and npm (if not already installed)
# For MacOS:
brew install node
# For Linux (Debian/Ubuntu):
sudo apt update
sudo apt install nodejs npm
# For Windows: Download from https://nodejs.org/

# Step 2: Initialize the project (if not already done)
npm init -y

# Step 3: Install Hardhat
npm install --save-dev hardhat

# Step 4: Install Hardhat Toolbox for Ethers.js, Waffle, and other essentials
npm install --save-dev @nomicfoundation/hardhat-toolbox

# Step 5: Install OpenZeppelin Contracts for reusable smart contract components
npm install @openzeppelin/contracts

# Step 6: (Optional) Install Hardhat Etherscan plugin for contract verification
npm install --save-dev @nomiclabs/hardhat-etherscan

# Step 7: Install dotenv for managing environment variables
npm install dotenv

# Step 8: Install Web3.js (if needed for frontend interactions)
npm install web3

# Step 9: Install Mocha and Chai for testing smart contracts
npm install --save-dev mocha chai

# Optional: Install TypeScript and related tools if using TypeScript
npm install --save-dev typescript ts-node @types/node

# Optional: Install Solidity Coverage for test coverage analysis
npm install --save-dev solidity-coverage

# Optional: Install ESLint and Prettier for code linting and formatting
npm install --save-dev eslint prettier

# Optional: Install Hardhat Deploy for managing deployments
npm install --save-dev hardhat-deploy

# Optional: For Frontend Setup with React or Next.js
# For React:
npx create-react-app my-frontend
cd my-frontend
npm install web3 ethers

# For Next.js:
npx create-next-app my-frontend
cd my-frontend
npm install web3 ethers
