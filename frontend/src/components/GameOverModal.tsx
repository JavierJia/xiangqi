import React from 'react';

interface GameOverModalProps {
  message: string;
  onClose: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Game Over</h2>
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default GameOverModal; 