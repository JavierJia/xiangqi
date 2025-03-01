from enum import Enum
from typing import List, Tuple, TYPE_CHECKING

if TYPE_CHECKING:
    from .board import Board

class PieceType(Enum):
    GENERAL = "general"
    ADVISOR = "advisor"
    ELEPHANT = "elephant"
    HORSE = "horse"
    CHARIOT = "chariot"
    CANNON = "cannon"
    SOLDIER = "soldier"

class Color(Enum):
    RED = "red"
    BLACK = "black"

class Piece:
    def __init__(self, piece_type: PieceType, color: Color):
        self.piece_type = piece_type
        self.color = color
    
    def get_legal_moves(self, position: Tuple[int, int], board: 'Board') -> List[Tuple[int, int]]:
        if self.piece_type == PieceType.GENERAL:
            return self._get_general_moves(position, board)
        elif self.piece_type == PieceType.ADVISOR:
            return self._get_advisor_moves(position, board)
        elif self.piece_type == PieceType.ELEPHANT:
            return self._get_elephant_moves(position, board)
        elif self.piece_type == PieceType.HORSE:
            return self._get_horse_moves(position, board)
        elif self.piece_type == PieceType.CHARIOT:
            return self._get_chariot_moves(position, board)
        elif self.piece_type == PieceType.CANNON:
            return self._get_cannon_moves(position, board)
        elif self.piece_type == PieceType.SOLDIER:
            return self._get_soldier_moves(position, board)
        return []
    
    def _is_valid_position(self, x: int, y: int, board: 'Board') -> bool:
        """Check if position is within board bounds"""
        return 0 <= x < board.width and 0 <= y < board.height

    def _is_own_piece(self, x: int, y: int, board: 'Board') -> bool:
        """Check if position contains own piece"""
        piece = board.board[y][x]
        return piece is not None and piece.color == self.color

    def _get_general_moves(self, position: Tuple[int, int], board: 'Board') -> List[Tuple[int, int]]:
        x, y = position
        moves = []
        # General can only move within palace (3x3)
        palace_x_range = range(3, 6)
        palace_y_range = range(7, 10) if self.color == Color.RED else range(0, 3)
        
        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            new_x, new_y = x + dx, y + dy
            if (new_x in palace_x_range and new_y in palace_y_range and
                self._is_valid_position(new_x, new_y, board) and
                not self._is_own_piece(new_x, new_y, board)):
                moves.append((new_x, new_y))
        
        return moves

    def _get_advisor_moves(self, position: Tuple[int, int], board: 'Board') -> List[Tuple[int, int]]:
        x, y = position
        moves = []
        palace_x_range = range(3, 6)
        palace_y_range = range(7, 10) if self.color == Color.RED else range(0, 3)
        
        for dx, dy in [(1, 1), (1, -1), (-1, 1), (-1, -1)]:
            new_x, new_y = x + dx, y + dy
            if (new_x in palace_x_range and new_y in palace_y_range and
                self._is_valid_position(new_x, new_y, board) and
                not self._is_own_piece(new_x, new_y, board)):
                moves.append((new_x, new_y))
        
        return moves

    def _get_elephant_moves(self, position: Tuple[int, int], board: 'Board') -> List[Tuple[int, int]]:
        x, y = position
        moves = []
        # Elephant moves exactly two points diagonally and cannot cross river
        river_boundary = 5 if self.color == Color.RED else 4
        
        for dx, dy in [(2, 2), (2, -2), (-2, 2), (-2, -2)]:
            new_x, new_y = x + dx, y + dy
            middle_x, middle_y = x + dx//2, y + dy//2
            
            if (self._is_valid_position(new_x, new_y, board) and
                not self._is_own_piece(new_x, new_y, board) and
                board.board[middle_y][middle_x] is None and  # Check if blocked
                ((self.color == Color.RED and y >= river_boundary) or
                 (self.color == Color.BLACK and y <= river_boundary))):
                moves.append((new_x, new_y))
        
        return moves

    def _get_horse_moves(self, position: Tuple[int, int], board: 'Board') -> List[Tuple[int, int]]:
        x, y = position
        moves = []
        # Horse moves one step orthogonally and one step diagonally
        for dx, dy in [(1, 2), (1, -2), (-1, 2), (-1, -2), (2, 1), (2, -1), (-2, 1), (-2, -1)]:
            new_x, new_y = x + dx, y + dy
            block_x = x + (dx // 2)
            block_y = y + (dy // 2)
            
            if (self._is_valid_position(new_x, new_y, board) and
                not self._is_own_piece(new_x, new_y, board) and
                board.board[block_y][block_x] is None):  # Check if blocked
                moves.append((new_x, new_y))
        
        return moves

    def _get_chariot_moves(self, position: Tuple[int, int], board: 'Board') -> List[Tuple[int, int]]:
        x, y = position
        moves = []
        
        # Check all four directions
        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            new_x, new_y = x + dx, y + dy
            while self._is_valid_position(new_x, new_y, board):
                if board.board[new_y][new_x] is None:
                    moves.append((new_x, new_y))
                elif board.board[new_y][new_x].color != self.color:
                    moves.append((new_x, new_y))
                    break
                else:
                    break
                new_x, new_y = new_x + dx, new_y + dy
        
        return moves

    def _get_cannon_moves(self, position: Tuple[int, int], board: 'Board') -> List[Tuple[int, int]]:
        x, y = position
        moves = []
        
        for dx, dy in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            new_x, new_y = x + dx, y + dy
            platform_found = False
            
            while self._is_valid_position(new_x, new_y, board):
                if not platform_found:
                    if board.board[new_y][new_x] is None:
                        moves.append((new_x, new_y))
                    else:
                        platform_found = True
                else:
                    if board.board[new_y][new_x] is not None:
                        if board.board[new_y][new_x].color != self.color:
                            moves.append((new_x, new_y))
                        break
                new_x, new_y = new_x + dx, new_y + dy
        
        return moves

    def _get_soldier_moves(self, position: Tuple[int, int], board: 'Board') -> List[Tuple[int, int]]:
        x, y = position
        moves = []
        river_crossed = (y < 5) if self.color == Color.RED else (y > 4)
        
        # Forward movement
        dy = -1 if self.color == Color.RED else 1
        new_y = y + dy
        if self._is_valid_position(x, new_y, board) and not self._is_own_piece(x, new_y, board):
            moves.append((x, new_y))
        
        # Sideways movement after crossing river
        if river_crossed:
            for dx in [-1, 1]:
                new_x = x + dx
                if self._is_valid_position(new_x, y, board) and not self._is_own_piece(new_x, y, board):
                    moves.append((new_x, y))
        
        return moves