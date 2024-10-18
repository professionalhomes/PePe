// src/components/OpenPacks.js
import React, { useState } from 'react';
import axios from 'axios';

function OpenPacks({ account }) {
  const [packId, setPackId] = useState(''); // ID of the pack to open
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [cards, setCards] = useState([]);

  const handleOpenPack = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    if (!packId) {
      alert("Please enter a valid pack ID.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/openPack', {
        packId,
      });
      setTransaction(response.data.transaction);
      alert('Pack opened successfully!');
      
      // Fetch newly minted card details (this can be a separate API call if needed)
      const newCards = await Promise.all(
        response.data.transaction.events.map(async (event) => {
          const tokenId = event.args[2].toString(); // Assuming mint event args[2] is tokenId
          const cardData = await axios.get(`http://localhost:5000/cards/metadata/${tokenId}`);
          return cardData.data;
        })
      );

      setCards(newCards);
    } catch (error) {
      console.error('Error opening pack:', error);
      alert('Failed to open pack. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Open Your Card Pack</h2>
      <div>
        <label>Enter Pack ID:</label>
        <input
          type="text"
          value={packId}
          onChange={(e) => setPackId(e.target.value)}
        />
      </div>
      <button onClick={handleOpenPack} disabled={loading}>
        {loading ? 'Processing...' : 'Open Pack'}
      </button>
      {transaction && (
        <div>
          <h4>Transaction Details:</h4>
          <p>Transaction Hash: {transaction.hash}</p>
        </div>
      )}
      {cards.length > 0 && (
        <div>
          <h4>Newly Minted Cards:</h4>
          {cards.map((card, index) => (
            <div key={index}>
              <p><strong>Name:</strong> {card.name}</p>
              <p><strong>Rarity:</strong> {card.rarity}</p>
              <p><strong>Ability:</strong> {card.ability}</p>
              <p><strong>Power:</strong> {card.power}</p>
              <p><strong>Defense:</strong> {card.defense}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OpenPacks;
