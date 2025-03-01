import { useEffect, useCallback } from 'react';
import { Position, Piece } from '../types';

export function useGameWebSocket(
  gameId: string,
  onMessage: (message: any) => void
) {
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${gameId}`);
    
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    return () => {
      ws.close();
    };
  }, [gameId, onMessage]);

  const sendMove = useCallback((from: Position, to: Position, piece: Piece) => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${gameId}`);
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'MOVE',
        from,
        to,
        piece
      }));
    };
  }, [gameId]);

  return { sendMove };
}