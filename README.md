# Xiangqi (Chinese Chess)

A web-based implementation of Chinese Chess using React and FastAPI.

## Project Structure

```
.
├── frontend/          # React frontend
├── backend/          # FastAPI backend
└── ml/              # Machine learning models (future)
```

## Goal
Build a Chinese Chess (Xiangqi) web game. 

## Rules of Xiangqi

### Game Overview
Xiangqi (象棋), also known as Chinese Chess, is a two-player strategy board game. The game represents a battle between two armies, with the goal of capturing the enemy's General (similar to checkmate in Western chess).

### Board Layout
- The board consists of 9 vertical lines and 10 horizontal lines
- A river divides the board into two territories
- The pieces are placed on the intersections rather than squares
- Each side has a palace (3x3 area) where the General and Advisors must stay

### Pieces and Their Movements
1. **General (將/帥)**
   - Moves one step orthogonally
   - Must stay within the palace
   - Cannot face the opposing General directly

2. **Advisors (士/仕)** - 2 pieces
   - Move one step diagonally
   - Must stay within the palace

3. **Elephants (象/相)** - 2 pieces
   - Move exactly two points diagonally
   - Cannot cross the river
   - Can be blocked at the middle point

4. **Horses (馬)** - 2 pieces
   - Move one point orthogonally then one point diagonally outward
   - Can be blocked by adjacent pieces

5. **Chariots (車)** - 2 pieces
   - Move any distance orthogonally
   - Similar to rooks in Western chess

6. **Cannons (炮)** - 2 pieces
   - Move like Chariots
   - Must jump over exactly one piece to capture

7. **Soldiers (兵/卒)** - 5 pieces
   - Move one step forward before crossing the river
   - After crossing the river, can move one step forward or sideways

### Basic Rules
- Red moves first
- Pieces capture by replacement
- A player loses when their General is checkmated
- Perpetual checks and chases are forbidden
- Stalemate is a draw

### Special Rules
- The "Flying General" rule: Generals cannot face each other directly
- Elephants cannot cross the river
- Soldiers cannot move backward


## System Design

### 1. Web-Based Interface
- **Game Modes**
  - Human vs Human (local and online multiplayer)
  - Human vs Computer (multiple difficulty levels)
  - Computer vs Computer (for demonstration and training)
- **Features**
  - Interactive board with drag-and-drop piece movement
  - Legal move highlighting
  - Move history and notation
  - Game state persistence
  - Real-time multiplayer using WebSocket

### 2. Reinforcement Learning System
- **Training Pipeline**
  - Self-play mechanism using RL algorithms
  - Model architecture based on AlphaZero/MuZero principles
  - Policy and value networks for move prediction and position evaluation
  - Monte Carlo Tree Search (MCTS) for game tree exploration

- **Learning Process Visualization**
  - Real-time training metrics dashboard
    - Win rates
    - Loss curves
    - Policy entropy
    - Value accuracy
  - Interactive game replay system
  - Model performance comparison tools

### 3. Technical Stack
- **Frontend**
  - React/Vue.js for UI components
  - Canvas/SVG for board rendering
  - WebSocket for real-time communication

- **Backend**
  - Python FastAPI/Django for game logic and API
  - PyTorch/TensorFlow for RL implementation
  - Redis for game state and session management
  - PostgreSQL for user data and game records

### 4. Development Phases
1. Basic game engine implementation
2. Web interface development
3. Human vs Human gameplay
4. RL model development and training
5. AI integration and difficulty levels
6. Training visualization dashboard
7. Performance optimization and scaling 