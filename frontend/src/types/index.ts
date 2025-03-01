export interface Position {
  x: number;
  y: number;
}

export class Piece {
  type: PieceType;
  color: PieceColor;
  position: Position;

  constructor(type: PieceType, color: PieceColor, position: Position) {
    this.type = type;
    this.color = color;
    this.position = position;
  }

  getLegalMoves(pieces: Piece[], calculateMoves: (piece: Piece, pieces: Piece[]) => Position[]): Position[] {
    // Use the passed calculateMoves function to determine valid moves
    return calculateMoves(this, pieces);
  }
}

export enum PieceType {
  GENERAL = 'general',
  ADVISOR = 'advisor',
  ELEPHANT = 'elephant',
  HORSE = 'horse',
  CHARIOT = 'chariot',
  CANNON = 'cannon',
  SOLDIER = 'soldier'
}

export enum PieceColor {
  RED = 'red',
  BLACK = 'black'
}