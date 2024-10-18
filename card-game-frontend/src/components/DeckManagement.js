// src/components/DeckManagement.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DeckManagement({ account }) {
  const [cards, setCards] = useState([]);  // All cards owned by the user
  const [deck, setDeck] = useState([]);    // User's selected deck
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) {
      fetchUserCards();
    }
  }, [account]);

  const fetchUserCards = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/getUserCards/${account}`);
      setCards(response.data.cards);
    } catch (error) {
      console.error('Error fetching user cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToDeck = (card) => {
    if (deck.length >= 5) {
      alert('You can only have 5 cards in your deck.');
      return;
    }
    if (!deck.includes(card)) {
      setDeck([...deck, card]);
    }
  };

  const removeFromDeck = (card) => {
    setDeck(deck.filter((c) => c.id !== card.id));
  };

  return (
    <div>
      <h2>Manage Your Deck</h2>
      {loading ? (
        <p>Loading your cards...</p>
      ) : (
        <div>
          <h3>Your Cards:</h3>
          <div className="card-list">
            {cards.map((card, index) => (
              <div key={index} className="card-item">
                <p><strong>Name:</strong> {card.name}</p>
                <p><strong>Rarity:</strong> {card.rarity}</p>
                <p><strong>Ability:</strong> {card.ability}</p>
                <p><strong>Power:</strong> {card.power}</p>
                <p><strong>Defense:</strong> {card.defense}</p>
                <button onClick={() => addToDeck(card)}>Add to Deck</button>
              </div>
            ))}
          </div>
          <h3>Your Deck (Max 5 Cards):</h3>
          <div className="deck-list">
            {deck.map((card, index) => (
              <div key={index} className="deck-item">
                <p><strong>Name:</strong> {card.name}</p>
                <p><strong>Rarity:</strong> {card.rarity}</p>
                <button onClick={() => removeFromDeck(card)}>Remove from Deck</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DeckManagement;
