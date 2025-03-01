from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict
from pydantic import BaseModel
from .core.board import Board
from .core.piece import Piece, PieceType, Color
import json

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, game_id: str):
        await websocket.accept()
        self.active_connections[game_id] = websocket

    def disconnect(self, game_id: str):
        if game_id in self.active_connections:
            del self.active_connections[game_id]

    async def broadcast_move(self, game_id: str, move_data: dict):
        if game_id in self.active_connections:
            await self.active_connections[game_id].send_json(move_data)

manager = ConnectionManager()

class Position(BaseModel):
    x: int
    y: int

class MoveRequest(BaseModel):
    from_pos: Position
    to_pos: Position

class GameState(BaseModel):
    board: List[List[Optional[dict]]]
    current_turn: str
    game_over: bool
    winner: Optional[str]

@app.get("/")
async def root():
    return {"message": "Xiangqi Game API"}

@app.post("/game/move")
async def make_move(move: MoveRequest):
    # TODO: Implement move validation and game state update
    return {"valid": True, "message": "Move successful"}

@app.get("/game/state")
async def get_game_state():
    # TODO: Return current game state
    return {"message": "Game state"}

@app.websocket("/ws/{game_id}")
async def websocket_endpoint(websocket: WebSocket, game_id: str):
    await manager.connect(websocket, game_id)
    try:
        while True:
            data = await websocket.receive_json()
            # Process move and broadcast to other player
            await manager.broadcast_move(game_id, {
                "type": "MOVE",
                "from": data["from"],
                "to": data["to"],
                "piece": data["piece"]
            })
    except WebSocketDisconnect:
        manager.disconnect(game_id)