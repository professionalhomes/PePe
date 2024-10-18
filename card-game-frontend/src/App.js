// src/App.js
import React, { useState } from 'react';
import { useWeb3 } from './hooks/useWeb3';
import './App.css';
import BuyPacks from './components/BuyPacks';
import OpenPacks from './components/OpenPacks';
import DeckManagement from './components/DeckManagement';
import GameLogic from './components/GameLogic';

function App() {
  const { account } = useWeb3();
  const [playerDeck, setPlayerDeck] = useState([]);
  const [opponentDeck, setOpponentDeck] = useState([
    // Example opponent deck
    { name: 'Opponent Card 1', power: 5, defense: 7 },
    { name: 'Opponent Card 2', power: 6, defense: 5 },
    { name: 'Opponent Card 3', power: 8, defense: 6 },
    { name: 'Opponent Card 4', power: 7, defense: 8 },
    { name: 'Opponent Card 5', power: 9, defense: 4 },
  ]);

  // Function to abbreviate the Ethereum address
  const abbreviateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="App">
      <div className='box'>
      <div className="app-logo"></div> {/* Define a div to hold the logo image */}
      {account && (
        <div className="account-pill">
          {abbreviateAddress(account)}
        </div>
      )}
      </div>
      {account ? (
        <>
          <div className="box">
            <BuyPacks account={account} />
          </div>
          <div className="box">
            <OpenPacks account={account} />
          </div>
          <div className="box">
            <DeckManagement account={account} />
          </div>
          {playerDeck.length === 5 && (
            <div className="box">
              <GameLogic playerDeck={playerDeck} opponentDeck={opponentDeck} />
            </div>
          )}
        </>
      ) : (
        <p>Please connect your wallet</p>
      )}
    </div>
  );
}

export default App;
