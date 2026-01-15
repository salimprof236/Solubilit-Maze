import React from 'react';
import { Maze } from './components/Maze';

const App: React.FC = () => {
  return (
    <div className="antialiased text-slate-900 font-sans">
      <Maze />
    </div>
  );
};

export default App;