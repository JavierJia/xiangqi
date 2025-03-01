import React from 'react';
import './App.css';
import { Board } from './components/Board';

function App() {
  return (
    <div className="App">
      <h1>Xiangqi (Chinese Chess)</h1>
      <Board gameId="game1" />
    </div>
  );
}

export default App;
