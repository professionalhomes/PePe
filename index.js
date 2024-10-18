require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const app = express();

// More permissive CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));
  
  app.use(express.json());
  
  // Detailed logging middleware
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  });
  
  // Add headers to all responses
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    next();
  });
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  });
  
// Initialize Ethereum provider and wallet
console.log("process.env.INFURA_API_URL",process.env.INFURA_API_URL)
const provider = new ethers.JsonRpcProvider(process.env.INFURA_API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Load contract ABIs and set up contract instances
const nftCardAbi = require('./artifacts/contracts/NFTCard.sol/NFTCard.json').abi;
const cardPackAbi = require('./artifacts/contracts/CardPack.sol/CardPack.json').abi;
const nftCardContract = new ethers.Contract(process.env.NFT_CARD_ADDRESS, nftCardAbi, wallet);
const cardPackContract = new ethers.Contract(process.env.CARD_PACK_ADDRESS, cardPackAbi, wallet);

// Helper function to read card list from CSV
async function readCardList() {
    const cards = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, 'dataset_new.csv'))
            .pipe(csv({ separator: '\t' }))
            .on('data', (row) => {
                cards.push(row);
            })
            .on('end', () => {
                resolve(cards);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}


  app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!' });
  });

// Route: Open Pack
app.post('/openPack', async (req, res) => {
    const { packId, address } = req.body;

    try {
        const selectedCard = await selectRandomCard();
        console.log('Selected Card:', selectedCard);

        // Mint the card via the NFTCard contract
        const tx = await nftCardContract.mintCard(
            address,
            selectedCard.tokenURI,
            selectedCard.rarity,
            selectedCard.ability,
            selectedCard.power,
            selectedCard.defense
        );

        await tx.wait();

        // Fetch transaction events and send newly minted card details to the frontend
        const newTokenId = tx.events[0].args[2].toString(); // Assuming tokenId is in event args[2]
        const newCard = {
            name: selectedCard.name,
            rarity: selectedCard.rarity,
            ability: selectedCard.ability,
            power: selectedCard.power,
            defense: selectedCard.defense,
            tokenURI: selectedCard.tokenURI
        };

        res.json({ success: true, transaction: tx, newCard });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/getUserCards/:account', async (req, res) => {
    const { account } = req.params;
    console.log(`Fetching cards for account: ${account}`);
    try {
      const userCards = await getUserOwnedCards(account);
      console.log(`Successfully fetched ${userCards.length} cards for ${account}`);
      res.json({ success: true, cards: userCards });
    } catch (error) {
      console.error(`Error fetching cards for ${account}:`, error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

// Simulate user's owned cards (this should interact with your contract in a real case)
async function getUserOwnedCards(account) {
    // Simulate fetching user's cards
    return await readCardList(); // Example only, you should fetch from contract
}

// Simulate card selection from the dataset
async function selectRandomCard() {
    const cards = await readCardList();
    const randomIndex = Math.floor(Math.random() * cards.length);
    const selectedCard = cards[randomIndex];
    
    // Example metadata
    return {
        tokenURI: `ipfs://mocked-uri/${randomIndex}`,
        name: selectedCard.Name,
        rarity: selectedCard.Rarity,
        ability: selectedCard.Ability,
        power: parseInt(selectedCard.Power, 10),
        defense: parseInt(selectedCard.Defense, 10)
    };
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
