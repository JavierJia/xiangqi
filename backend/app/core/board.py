from typing import List, Optional, Tuple
from .piece import Piece, PieceType, Color

class Board:
    def __init__(self):
        self.width = 9
        self.height = 10
        self.board = self._initialize_board()
        self.current_turn = Color.RED
    
    def _initialize_board(self) -> List[List[Optional[Piece]]]:
        """Initialize the board with starting positions"""
        board = [[None for _ in range(self.width)] for _ in range(self.height)]
        
        # Initialize pieces
        # Red pieces (bottom)
        self._place_piece(0, 9, PieceType.CHARIOT, Color.RED, board)
        self._place_piece(1, 9, PieceType.HORSE, Color.RED, board)
        # ... Add all other pieces
        
        return board
    
    def _place_piece(self, x: int, y: int, piece_type: PieceType, 
                     color: Color, board: List[List[Optional[Piece]]]):
        """Helper method to place a piece on the board"""
        board[y][x] = Piece(piece_type, color)
    
    def make_move(self, from_pos: Tuple[int, int], 
                  to_pos: Tuple[int, int]) -> bool:
        """
        Make a move on the board
        Returns True if move is valid and executed
        """
        from_x, from_y = from_pos
        to_x, to_y = to_pos
        
        piece = self.board[from_y][from_x]
        if not piece or piece.color != self.current_turn:
            return False
            
        if to_pos in self.get_legal_moves(from_pos):
            # Execute move
            self.board[to_y][to_x] = piece
            self.board[from_y][from_x] = None
            self.current_turn = Color.BLACK if self.current_turn == Color.RED else Color.RED
            return True
            
        return False
    
    def get_legal_moves(self, position: Tuple[int, int]) -> List[Tuple[int, int]]:
        """Get all legal moves for a piece at given position"""
        x, y = position
        piece = self.board[y][x]
        if not piece:
            return []
            
        return piece.get_legal_moves(position, self)
    
    def is_game_over(self) -> Tuple[bool, Optional[Color]]:
        """
        Check if the game is over
        Returns (is_over, winner_color)
        """
        # TODO: Implement checkmate detection
        return False, None