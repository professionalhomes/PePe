// src/components/GameLogic.js
import React, { useState } from 'react';

function GameLogic({ playerDeck, opponentDeck }) {
  const [roundResults, setRoundResults] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const startBattle = () => {
    let playerPoints = 0;
    let opponentPoints = 0;
    let results = [];

    for (let i = 0; i < 5; i++) {
      const playerCard = playerDeck[i];
      const opponentCard = opponentDeck[i];

      // Determine winner based on Power vs. Defense
      let roundResult = {
        playerCard: playerCard.name,
        opponentCard: opponentCard.name,
        winner: "",
      };

      if (playerCard.power > opponentCard.defense) {
        playerPoints++;
        roundResult.winner = "Player";
      } else if (opponentCard.power > playerCard.defense) {
        opponentPoints++;
        roundResult.winner = "Opponent";
      } else {
        roundResult.winner = "Draw";
      }

      results.push(roundResult);
    }

    setPlayerScore(playerPoints);
    setOpponentScore(opponentPoints);
    setRoundResults(results);
    setGameOver(true);
  };

  return (
    <div>
      <h2>Game Logic Simulation</h2>
      <button onClick={startBattle} disabled={gameOver}>
        Start Battle
      </button>

      {gameOver && (
        <>
          <h3>Battle Results</h3>
          <ul>
            {roundResults.map((result, index) => (
              <li key={index}>
                Round {index + 1}: {result.playerCard} vs. {result.opponentCard} - Winner: {result.winner}
              </li>
            ))}
          </ul>
          <h4>Final Score</h4>
          <p>Player Score: {playerScore}</p>
          <p>Opponent Score: {opponentScore}</p>
          <h3>{playerScore > opponentScore ? "Player Wins!" : "Opponent Wins!"}</h3>
        </>
      )}
    </div>
  );
}

export default GameLogic;
