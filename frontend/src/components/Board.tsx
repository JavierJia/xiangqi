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

// Example implementations for each piece type
function calculateGeneralMoves(piece: Piece, pieces: Piece[]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const directions = [
    { x: 0, y: 1 }, // Move up
    { x: 0, y: -1 }, // Move down
    { x: 1, y: 0 }, // Move right
    { x: -1, y: 0 } // Move left
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
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const potentialMoves = [
    { x: x + 1, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x: x - 1, y: y + 1 },
    { x: x - 1, y: y - 1 }
  ];

  for (const move of potentialMoves) {
    const isInPalace = piece.color === PieceColor.RED
      ? (move.x >= 3 && move.x <= 5 && move.y >= 7 && move.y <= 9)
      : (move.x >= 3 && move.x <= 5 && move.y >= 0 && move.y <= 2);

    if (isInPalace) {
      const pieceAtPosition = pieces.find(p => 
        p.position.x === move.x && p.position.y === move.y
      );
      if (!pieceAtPosition || pieceAtPosition.color !== piece.color) {
        moves.push(move);
      }
    }
  }

  return moves;
}

function calculateElephantMoves(piece: Piece, pieces: Piece[]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const potentialMoves = [
    { x: x + 2, y: y + 2 },
    { x: x + 2, y: y - 2 },
    { x: x - 2, y: y + 2 },
    { x: x - 2, y: y - 2 }
  ];

  for (const move of potentialMoves) {
    const isInPalace = piece.color === PieceColor.RED
      ? (move.x >= 0 && move.x <= 8 && move.y >= 5 && move.y <= 9)
      : (move.x >= 0 && move.x <= 8 && move.y >= 0 && move.y <= 4);

    if (isInPalace) {
      const pieceAtPosition = pieces.find(p => 
        p.position.x === move.x && p.position.y === move.y
      );
      if (!pieceAtPosition || pieceAtPosition.color !== piece.color) {
        moves.push(move);
      }
    }
  }

  return moves;
}

function calculateHorseMoves(piece: Piece, pieces: Piece[]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;
  const potentialMoves = [
    { x: x + 1, y: y + 2 },
    { x: x + 1, y: y - 2 },
    { x: x - 1, y: y + 2 },
    { x: x - 1, y: y - 2 },
    { x: x + 2, y: y + 1 },
    { x: x + 2, y: y - 1 },
    { x: x - 2, y: y + 1 },
    { x: x - 2, y: y - 1 }
  ];

  for (const move of potentialMoves) {
    const pieceAtPosition = pieces.find(p => 
      p.position.x === move.x && p.position.y === move.y
    );
    if (move.x < 0 || move.x> 8 || move.x < 0 || move.y> 9) continue; // Out of bounds
    if (!pieceAtPosition || pieceAtPosition.color !== piece.color) {
      // Check if the horse's path is blocked
      const isBlocked = pieces.some(p => 
        (p.position.x === x + (move.x - x) / 2 && p.position.y === y) || 
        (p.position.y === y + (move.y - y) / 2 && p.position.x === x)
      );
      if (!isBlocked) {
        moves.push(move);
      }
    }
  }

  return moves;
}

function calculateChariotMoves(piece: Piece, pieces: Piece[]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;

  // Check all four directions
  const directions = [
    { x: 1, y: 0 }, // Right
    { x: -1, y: 0 }, // Left
    { x: 0, y: 1 }, // Down
    { x: 0, y: -1 } // Up
  ];

  for (const dir of directions) {
    let newX = x;
    let newY = y;

    while (true) {
      newX += dir.x;
      newY += dir.y;

      if (newX < 0 || newX > 8 || newY < 0 || newY > 9) break; // Out of bounds

      const pieceAtPosition = pieces.find(p => 
        p.position.x === newX && p.position.y === newY
      );

      if (pieceAtPosition) {
        if (pieceAtPosition.color !== piece.color) {
          moves.push({ x: newX, y: newY }); // Capture
        }
        break; // Blocked by a piece
      }

      moves.push({ x: newX, y: newY }); // Valid move
    }
  }

  return moves;
}

function calculateCannonMoves(piece: Piece, pieces: Piece[]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;

  // Check all four directions
  const directions = [
    { x: 1, y: 0 }, // Right
    { x: -1, y: 0 }, // Left
    { x: 0, y: 1 }, // Down
    { x: 0, y: -1 } // Up
  ];

  for (const dir of directions) {
    let newX = x;
    let newY = y;
    let hasPiece = false;

    while (true) {
      newX += dir.x;
      newY += dir.y;

      if (newX < 0 || newX > 8 || newY < 0 || newY > 9) break; // Out of bounds

      const pieceAtPosition = pieces.find(p => 
        p.position.x === newX && p.position.y === newY
      );

      if (pieceAtPosition) {
        if (hasPiece) {
          if (pieceAtPosition.color !== piece.color) {
            moves.push({ x: newX, y: newY }); // Capture
          }
        } else {
          hasPiece = true; // First piece encountered
        }
        break; // Blocked by a piece
      }

      moves.push({ x: newX, y: newY }); // Valid move
    }
  }

  return moves;
}

function calculateSoldierMoves(piece: Piece, pieces: Piece[]): Position[] {
  const moves: Position[] = [];
  const { x, y } = piece.position;

  // Soldiers can only move forward initially
  const forwardMove = piece.color === PieceColor.BLACK ? { x: 0, y: 1 } : { x: 0, y: -1 };
  const newX = x + forwardMove.x;
  const newY = y + forwardMove.y;

  // Check if the forward move is within bounds
  if (newX >= 0 && newX <= 8 && newY >= 0 && newY <= 9) {
    const pieceAtPosition = pieces.find(p => 
      p.position.x === newX && p.position.y === newY
    );
    if (!pieceAtPosition) {
      moves.push({ x: newX, y: newY }); // Move forward
    }
  }

  // Soldiers can move left and right after crossing the river
  if ((piece.color === PieceColor.BLACK && y >= 5) || (piece.color === PieceColor.RED && y <= 4)) {
    const lateralMoves = [
      { x: 1, y: 0 }, // Move right
      { x: -1, y: 0 } // Move left
    ];

    for (const move of lateralMoves) {
      const lateralX = x + move.x;
      const lateralY = y; // Stay on the same row

      if (lateralX >= 0 && lateralX <= 8 && lateralY >= 0 && lateralY <= 9) {
        const pieceAtLateralPosition = pieces.find(p => 
          p.position.x === lateralX && p.position.y === lateralY
        );
        if (!pieceAtLateralPosition) {
          moves.push({ x: lateralX, y: lateralY }); // Move left or right
        }
      }
    }
  }
  return moves;
}

function isPossibleMove(position: Position, possibleMoves: Position[]): boolean {
  return possibleMoves.some(pm => pm.x === position.x && pm.y === position.y);
}