// src/components/BuyPacks.js
import React, { useState } from 'react';
import axios from 'axios';

function BuyPacks({ account }) {
  const [packCount, setPackCount] = useState(1); // Default to 1 packs
  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState(null);

  const handleBuyPacks = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/buyPacks', {
        address: account,
        packCount,
      });
      setTransaction(response.data.transaction);
      alert('Packs purchased successfully!');
    } catch (error) {
      console.error('Error buying packs:', error);
      alert('Failed to buy packs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Buy Card Packs</h2>
      <div>
        <label>Select Pack Count:</label>
        <input
          type="number"
          value={packCount}
          onChange={(e) => setPackCount(e.target.value)}
          min="3"
          step="2"
        />
      </div>
      <button onClick={handleBuyPacks} disabled={loading}>
        {loading ? 'Processing...' : 'Buy Packs'}
      </button>
      {transaction && (
        <div>
          <h4>Transaction Details:</h4>
          <p>Transaction Hash: {transaction.hash}</p>
        </div>
      )}
    </div>
  );
}

export default BuyPacks;
