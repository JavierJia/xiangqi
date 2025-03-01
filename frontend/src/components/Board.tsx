import React, { useState } from 'react';
import './Board.css';
import { Position, Piece, PieceType, PieceColor } from '../types/index';
import { useGameWebSocket } from '../hooks/useGameWebSocket';
import { getLegalMoves } from '../utils/moveUtils';

interface BoardProps {
  gameId: string;
}

export const Board: React.FC<BoardProps> = ({ gameId }) => {
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [pieces, setPieces] = useState<Piece[]>(getInitialPieces());
  const [validMoves, setValidMoves] = useState<Position[]>([]);
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
      if (piece) {
        setSelectedPosition(position);
        // Calculate valid moves directly on the frontend
        const validMoves = piece.getLegalMoves(pieces, calculatePossibleMoves);
        setValidMoves(validMoves);
      }
    } else {
      // Try to move piece
      const isValidMove = validMoves.some(move => 
        move.x === position.x && move.y === position.y
      );

      if (isValidMove) {
        const piece = pieces.find(p => 
          p.position.x === selectedPosition.x && 
          p.position.y === selectedPosition.y
        );
        
        if (piece) {
          // Send move through WebSocket
          sendMove(selectedPosition, position, piece);
          
          // Update local state
          setPieces(pieces.map(p => 
            (p.position.x === selectedPosition.x && p.position.y === selectedPosition.y)
              ? new Piece(p.type, p.color, position)
              : p
          ));
        }
      }
      
      // Clear selection
      setSelectedPosition(null);
      setValidMoves([]);
    }
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
            <div key={`vertical-${x}`} className="vertical-line" style={{ left: `${x * (100/8)}%` }} />
          ))}
          {Array(10).fill(0).map((_, y) => (
            <div key={`horizontal-${y}`} className="horizontal-line" style={{ top: `${y * (100/9)}%` }} />
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
            className={`piece ${piece.color} ${piece.type} ${
              selectedPosition?.x === piece.position.x && 
              selectedPosition?.y === piece.position.y ? 'selected' : ''
            }`}
            style={{
              left: `${piece.position.x * (100/8)}%`,
              top: `${piece.position.y * (100/9)}%`
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
                left: `${x * (100/8)}%`,
                top: `${y * (100/9)}%`
              }}
              onClick={() => handleSquareClick({ x, y })}
            />
          );
        })}
      </div>
    </div>
  );
};

const getInitialPieces = (): Piece[] => {
  return [
    new Piece(PieceType.CHARIOT, PieceColor.RED, { x: 0, y: 9 }),
    new Piece(PieceType.HORSE, PieceColor.RED, { x: 1, y: 9 }),
    new Piece(PieceType.ELEPHANT, PieceColor.RED, { x: 2, y: 9 }),
    new Piece(PieceType.ADVISOR, PieceColor.RED, { x: 3, y: 9 }),
    new Piece(PieceType.GENERAL, PieceColor.RED, { x: 4, y: 9 }),
    new Piece(PieceType.ADVISOR, PieceColor.RED, { x: 5, y: 9 }),
    new Piece(PieceType.ELEPHANT, PieceColor.RED, { x: 6, y: 9 }),
    new Piece(PieceType.HORSE, PieceColor.RED, { x: 7, y: 9 }),
    new Piece(PieceType.CHARIOT, PieceColor.RED, { x: 8, y: 9 }),
    new Piece(PieceType.CANNON, PieceColor.RED, { x: 1, y: 7 }),
    new Piece(PieceType.CANNON, PieceColor.RED, { x: 7, y: 7 }),
    new Piece(PieceType.SOLDIER, PieceColor.RED, { x: 0, y: 6 }),
    new Piece(PieceType.SOLDIER, PieceColor.RED, { x: 2, y: 6 }),
    new Piece(PieceType.SOLDIER, PieceColor.RED, { x: 4, y: 6 }),
    new Piece(PieceType.SOLDIER, PieceColor.RED, { x: 6, y: 6 }),
    new Piece(PieceType.SOLDIER, PieceColor.RED, { x: 8, y: 6 }),
    // Black pieces (top)
    new Piece(PieceType.CHARIOT, PieceColor.BLACK, { x: 0, y: 0 }),
    new Piece(PieceType.HORSE, PieceColor.BLACK, { x: 1, y: 0 }),
    new Piece(PieceType.ELEPHANT, PieceColor.BLACK, { x: 2, y: 0 }),
    new Piece(PieceType.ADVISOR, PieceColor.BLACK, { x: 3, y: 0 }),
    new Piece(PieceType.GENERAL, PieceColor.BLACK, { x: 4, y: 0 }),
    new Piece(PieceType.ADVISOR, PieceColor.BLACK, { x: 5, y: 0 }),
    new Piece(PieceType.ELEPHANT, PieceColor.BLACK, { x: 6, y: 0 }),
    new Piece(PieceType.HORSE, PieceColor.BLACK, { x: 7, y: 0 }),
    new Piece(PieceType.CHARIOT, PieceColor.BLACK, { x: 8, y: 0 }),
    new Piece(PieceType.CANNON, PieceColor.BLACK, { x: 1, y: 2 }),
    new Piece(PieceType.CANNON, PieceColor.BLACK, { x: 7, y: 2 }),
    new Piece(PieceType.SOLDIER, PieceColor.BLACK, { x: 0, y: 3 }),
    new Piece(PieceType.SOLDIER, PieceColor.BLACK, { x: 2, y: 3 }),
    new Piece(PieceType.SOLDIER, PieceColor.BLACK, { x: 4, y: 3 }),
    new Piece(PieceType.SOLDIER, PieceColor.BLACK, { x: 6, y: 3 }),
    new Piece(PieceType.SOLDIER, PieceColor.BLACK, { x: 8, y: 3 }),
  ];
};

function getPieceSymbol(piece: Piece): string {
  const symbols: Record<PieceColor, Record<PieceType, string>> = {
    [PieceColor.RED]: {
      [PieceType.GENERAL]: '帥',
      [PieceType.ADVISOR]: '仕',
      [PieceType.ELEPHANT]: '相',
      [PieceType.HORSE]: '馬',
      [PieceType.CHARIOT]: '車',
      [PieceType.CANNON]: '炮',
      [PieceType.SOLDIER]: '兵',
    },
    [PieceColor.BLACK]: {
      [PieceType.GENERAL]: '將',
      [PieceType.ADVISOR]: '士',
      [PieceType.ELEPHANT]: '象',
      [PieceType.HORSE]: '馬',
      [PieceType.CHARIOT]: '車',
      [PieceType.CANNON]: '炮',
      [PieceType.SOLDIER]: '卒',
    },
  };
  return symbols[piece.color][piece.type];
}

function calculatePossibleMoves(piece: Piece, pieces: Piece[]): Position[] {
  switch (piece.type) {
    case PieceType.GENERAL:
      return calculateGeneralMoves(piece, pieces);
    case PieceType.ADVISOR:
      return calculateAdvisorMoves(piece, pieces);
    case PieceType.ELEPHANT:
      return calculateElephantMoves(piece, pieces);
    case PieceType.HORSE:
      return calculateHorseMoves(piece, pieces);
    case PieceType.CHARIOT:
      return calculateChariotMoves(piece, pieces);
    case PieceType.CANNON:
      return calculateCannonMoves(piece, pieces);
    case PieceType.SOLDIER:
      return calculateSoldierMoves(piece, pieces);
    default:
      return [];
  }
}

function calculateGeneralMoves(piece: Piece, pieces: Piece[]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const directions = [
    { x: 0, y: 1 }, { x: 0, y: -1 },
    { x: 1, y: 0 }, { x: -1, y: 0 }
  ];

  for (const dir of directions) {
    const newX = x + dir.x;
    const newY = y + dir.y;
    
    // Check palace boundaries (3x3)
    const isInPalace = piece.color === PieceColor.RED
      ? (newX >= 3 && newX <= 5 && newY >= 7 && newY <= 9)
      : (newX >= 3 && newX <= 5 && newY >= 0 && newY <= 2);

    if (isInPalace) {
      const pieceAtPosition = pieces.find(p => 
        p.position.x === newX && p.position.y === newY
      );
      
      if (!pieceAtPosition || pieceAtPosition.color !== piece.color) {
        moves.push({ x: newX, y: newY });
      }
    }
  }

  return moves;
}

function calculateAdvisorMoves(piece: Piece, pieces: Piece[]): Position[] {
  // Implementation of calculateAdvisorMoves
  return [];
}

function calculateElephantMoves(piece: Piece, pieces: Piece[]): Position[] {
  // Implementation of calculateElephantMoves
  return [];
}

function calculateHorseMoves(piece: Piece, pieces: Piece[]): Position[] {
  // Implementation of calculateHorseMoves
  return [];
}

function calculateChariotMoves(piece: Piece, pieces: Piece[]): Position[] {
  // Implementation of calculateChariotMoves
  return [];
}

function calculateCannonMoves(piece: Piece, pieces: Piece[]): Position[] {
  // Implementation of calculateCannonMoves
  return [];
}

function calculateSoldierMoves(piece: Piece, pieces: Piece[]): Position[] {
  // Implementation of calculateSoldierMoves
  return [];
}

function isPossibleMove(position: Position, possibleMoves: Position[]): boolean {
  return possibleMoves.some(pm => pm.x === position.x && pm.y === position.y);
}