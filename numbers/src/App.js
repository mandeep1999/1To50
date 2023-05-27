import { useState } from 'react';
import './App.css';
import NumberGame from './pages/numbers';

function App() {
  const [gameKey, setGameKey] = useState(() => Date.now());
  const onRestart = () => setGameKey(Date.now());
  return (
    <div className='App'>
      <NumberGame onRestart={onRestart} key={gameKey} />
    </div>
  );
}

export default App;
