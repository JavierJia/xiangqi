import React, { useState } from 'react';

interface InfoPanelProps {
  player1Name: string;
  player2Name: string;
  setPlayer1Name: (name: string) => void;
  setPlayer2Name: (name: string) => void;
  isPlayer1AI: boolean;
  setPlayer1AI: (isAI: boolean) => void;
  isPlayer2AI: boolean;
  setPlayer2AI: (isAI: boolean) => void;
  movesCount: number;
  timeElapsed: string; // Format: "HH:MM:SS"
}

const InfoPanel: React.FC<InfoPanelProps> = ({
  player1Name,
  player2Name,
  setPlayer1Name,
  setPlayer2Name,
  isPlayer1AI,
  setPlayer1AI,
  isPlayer2AI,
  setPlayer2AI,
  movesCount,
  timeElapsed,
}) => {
  return (
    <div className="info-panel">
      <h2>Game Information</h2>
      <div>
        <label>
          Player 1 Name:
          <input
            type="text"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
          />
        </label>
        <label>
          AI:
          <input
            type="checkbox"
            checked={isPlayer1AI}
            onChange={(e) => setPlayer1AI(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          Player 2 Name:
          <input
            type="text"
            value={player2Name}
            onChange={(e) => setPlayer2Name(e.target.value)}
          />
        </label>
        <label>
          AI:
          <input
            type="checkbox"
            checked={isPlayer2AI}
            onChange={(e) => setPlayer2AI(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <p>Moves: {movesCount}</p>
        <p>Time Elapsed: {timeElapsed}</p>
      </div>
    </div>
  );
};

export default InfoPanel; 