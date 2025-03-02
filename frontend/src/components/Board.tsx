import React, { useState } from 'react';
import './Board.css';
import { Position, Piece, PieceType, PieceColor } from '../types/index';
import { useGameWebSocket } from '../hooks/useGameWebSocket';
import { calculatePossibleMoves } from '../utils/moveUtils';
import { getInitialPieces, getPieceSymbol } from '../utils/getInitialPieces';
import GameOverModal from './GameOverModal';

interface BoardProps {
  gameId: string;
}

export const Board: React.FC<BoardProps> = ({ gameId }) => {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [pieces, setPieces] = useState<Piece[]>(getInitialPieces());
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>(PieceColor.RED); // Start with Red
  const { sendMove } = useGameWebSocket(gameId, (message) => {
    // Handle incoming moves
    setPieces(pieces.map(p =>
      (p.position.x === message.from.x && p.position.y === message.from.y)
        ? new Piece(p.type, p.color, message.to)
        : p
    ));
  });

  const handleSquareClick = (position: Position) => {
    if (!selectedPosition) {
      // Select piece
      const piece = pieces.find(p =>
        p.position.x === position.x &&
        p.position.y === position.y
      );

      // Check if the piece belongs to the current player
      if (piece && piece.color === currentPlayer) {
        setSelectedPosition(position);
        // Calculate valid moves directly on the frontend
        const validMoves = calculatePossibleMoves(piece, pieces);
        setValidMoves(validMoves);
      }
    } else {
      // Try to move piece
      const isValidMove = validMoves.some(move =>
        move.x === position.x && move.y === position.y
      );

      if (isValidMove) {
        const movingPiece = pieces.find(p =>
          p.position.x === selectedPosition.x &&
          p.position.y === selectedPosition.y
        );

        if (movingPiece) {
          // Check if the target position has an opponent's piece
          const targetPiece = pieces.find(p =>
            p.position.x === position.x && p.position.y === position.y
          );

          // Send move through WebSocket
          sendMove(selectedPosition, position, movingPiece);

          // Update local state
          setPieces(pieces.filter(p =>
            !(targetPiece && p.position.x === targetPiece.position.x && p.position.y === targetPiece.position.y) // Remove captured piece
          ).map(p =>
            (p.position.x === selectedPosition.x && p.position.y === selectedPosition.y)
              ? new Piece(movingPiece.type, movingPiece.color, position) // Move the piece
              : p
          ));

          if (targetPiece) checkGameOver(targetPiece);
          // Switch to the next player
          setCurrentPlayer(currentPlayer === PieceColor.RED ? PieceColor.BLACK : PieceColor.RED);
        }
      }

      // Clear selection
      setSelectedPosition(null);
      setValidMoves([]);
    }
  };

  const checkGameOver = (targetPiece: Piece) => {
    const redGeneralCaptured = targetPiece.type === PieceType.GENERAL && targetPiece.color === PieceColor.RED;
    const blackGeneralCaptured = targetPiece.type === PieceType.GENERAL && targetPiece.color === PieceColor.BLACK;

    if (redGeneralCaptured) {
      setGameOverMessage("Black wins! Red general has been captured.");
    } else if (blackGeneralCaptured) {
      setGameOverMessage("Red wins! Black general has been captured.");
    }
  };

  const handleCloseModal = () => {
    // Reset the game state
    setPieces(getInitialPieces()); // Reset pieces to their initial positions
    setSelectedPosition(null); // Clear selected position
    setValidMoves([]); // Clear valid moves
    setGameOverMessage(null); // Close the modal
  };

  return (
    <div className="board">
      {/* Border area */}
      <div className="border-area" />

      {/* Playable area */}
      <div className="playable-area">
        {/* Grid lines */}
        <div className="grid-lines">
          {Array(9).fill(0).map((_, x) => (
            <div key={`vertical-${x}`} className="vertical-line" style={{ left: `${x * (100 / 8)}%` }} />
          ))}
          {Array(10).fill(0).map((_, y) => (
            <div key={`horizontal-${y}`} className="horizontal-line" style={{ top: `${y * (100 / 9)}%` }} />
          ))}
        </div>

        {/* River */}
        <div className="river" />

        {/* Valid moves */}
        {validMoves.map((pos, index) => (
          <div
            key={`valid-${index}`}
            className="valid-move"
            style={{
              left: `${(pos.x) * (100 / 8)}%`,
              top: `${(pos.y) * (100 / 9)}%`
            }}
          />
        ))}

        {/* Pieces */}
        {pieces.map((piece, index) => (
          <div
            key={`piece-${index}`}
            className={`piece ${piece.color} ${piece.type} ${selectedPosition?.x === piece.position.x &&
              selectedPosition?.y === piece.position.y ? 'selected' : ''
              }`}
            style={{
              left: `${piece.position.x * (100 / 8)}%`,
              top: `${piece.position.y * (100 / 9)}%`
            }}
          >
            {getPieceSymbol(piece)}
          </div>
        ))}

        {/* Click handlers */}
        {Array(90).fill(0).map((_, index) => {
          const x = index % 9;
          const y = Math.floor(index / 9);
          return (
            <div
              key={`square-${x}-${y}`}
              className="square"
              style={{
                left: `${x * (100 / 8)}%`,
                top: `${y * (100 / 9)}%`
              }}
              onClick={() => handleSquareClick({ x, y })}
            />
          );
        })}
      </div>

      {gameOverMessage && (
        <GameOverModal message={gameOverMessage} onClose={handleCloseModal} />
      )}
    </div>
  );
};


