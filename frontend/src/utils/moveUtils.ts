import { Piece, Position, PieceType, PieceColor } from '../types';

export function calculatePossibleMoves(piece: Piece, pieces: Piece[]): Position[] {
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
    let hasPiece = false; // Track if we have encountered a piece

    while (true) {
      newX += dir.x;
      newY += dir.y;

      if (newX < 0 || newX > 8 || newY < 0 || newY > 9) break; // Out of bounds

      const pieceAtPosition = pieces.find(p => 
        p.position.x === newX && p.position.y === newY
      );

      if (pieceAtPosition) {
        if (!hasPiece) {
          // First piece encountered, set hasPiece to true
          hasPiece = true;
        } else {
          // If we have already encountered a piece, we can capture
          if (pieceAtPosition.color !== piece.color) {
            moves.push({ x: newX, y: newY }); // Capture
          }
          break; // Blocked by a piece
        }
      } else if (!hasPiece){
        // Valid move if no pieces are in the way
        moves.push({ x: newX, y: newY });
      }
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
      p.position.x === newX && p.position.y === newY && p.color === piece.color
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

export function isPossibleMove(position: Position, possibleMoves: Position[]): boolean {
  return possibleMoves.some(pm => pm.x === position.x && pm.y === position.y);
}