import { Piece, PieceType, PieceColor, Position } from '../types';

export function getInitialPieces(): Piece[] {
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
} 

export function getPieceSymbol(piece: Piece): string {
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
