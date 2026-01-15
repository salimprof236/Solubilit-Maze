import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Play, RotateCcw, Award, Clock } from 'lucide-react';
import { Position, GameState, GameStats, Enemy } from '../types';
import { MAZE_GRID, QUESTIONS, GRID_SIZE, SPAWN_POS, ANSWER_LOCATIONS } from '../constants';
import { audioService } from '../services/audioService';
import { Controls } from './Controls';

export const Maze: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [playerPos, setPlayerPos] = useState<Position>(SPAWN_POS);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    timeLeft: 60,
    currentQuestionIndex: 0,
    totalTime: 0
  });
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [feedback, setFeedback] = useState<{msg: string, type: 'good' | 'bad' | null}>({msg: '', type: null});
  const timerRef = useRef<number>();
  const enemyMoveRef = useRef<number>();

  const currentQuestion = QUESTIONS[currentQIndex];

  // Initialize Game
  const startGame = () => {
    setGameState('playing');
    setPlayerPos(SPAWN_POS);
    setCurrentQIndex(0);
    setStats({ score: 0, timeLeft: 45, currentQuestionIndex: 1, totalTime: 0 });
    setEnemies([
      { id: 1, pos: { x: 1, y: 1 }, type: 'enemy-atom' },
      { id: 2, pos: { x: 13, y: 13 }, type: 'enemy-molecule' },
      { id: 3, pos: { x: 1, y: 13 }, type: 'enemy-electron' }
    ]);
    setFeedback({ msg: '', type: null });
    audioService.playSuccess(); // Init audio context
  };

  // Check valid move
  const isValidMove = (x: number, y: number) => {
    return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE && MAZE_GRID[y][x] === 0;
  };

  // Move Player
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameState !== 'playing') return;

    setPlayerPos(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;

      if (isValidMove(newX, newY)) {
        return { x: newX, y: newY };
      } else {
        audioService.playBump();
        return prev;
      }
    });
  }, [gameState]);

  // Handle Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      switch(e.key) {
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, movePlayer]);

  // Enemy Logic
  useEffect(() => {
    if (gameState !== 'playing') return;

    const moveEnemies = () => {
      setEnemies(prevEnemies => prevEnemies.map(enemy => {
        const moves = [
          { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }
        ];
        
        // Simple AI: Try to move towards player roughly, or random
        const validMoves = moves.filter(m => isValidMove(enemy.pos.x + m.x, enemy.pos.y + m.y));
        
        if (validMoves.length > 0) {
           const move = validMoves[Math.floor(Math.random() * validMoves.length)];
           return { ...enemy, pos: { x: enemy.pos.x + move.x, y: enemy.pos.y + move.y } };
        }
        return enemy;
      }));
    };

    const interval = setInterval(moveEnemies, 800); // Move every 800ms
    return () => clearInterval(interval);
  }, [gameState]);

  // Collision Detection & Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Timer
    timerRef.current = window.setInterval(() => {
      setStats(prev => {
        if (prev.timeLeft <= 0) {
          // Time run out for this question
          handleWrongAnswer();
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1, totalTime: prev.totalTime + 1 };
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState]);

  // Check interactions constantly
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Check Enemy Collision
    const hitEnemy = enemies.find(e => e.pos.x === playerPos.x && e.pos.y === playerPos.y);
    if (hitEnemy) {
      audioService.playError();
      setPlayerPos(SPAWN_POS);
      setFeedback({ msg: "Aïe ! Touché par une particule !", type: 'bad' });
      setTimeout(() => setFeedback({ msg: '', type: null }), 2000);
    }

    // Check Answer Collision
    currentQuestion.answers.forEach((ans, idx) => {
      // Map answers to specific corners based on index
      // If there are 3 answers, use first 3 locations
      const loc = ANSWER_LOCATIONS[idx % ANSWER_LOCATIONS.length];
      if (playerPos.x === loc.x && playerPos.y === loc.y) {
        if (ans.isCorrect) {
          handleCorrectAnswer();
        } else {
          handleWrongAnswer();
        }
      }
    });

  }, [playerPos, enemies, gameState, currentQIndex]);

  const handleCorrectAnswer = () => {
    audioService.playSuccess();
    setFeedback({ msg: "Bravo ! Bonne réponse !", type: 'good' });
    setStats(prev => ({ ...prev, score: prev.score + 10 + prev.timeLeft }));
    
    // Determine next step
    if (currentQIndex < QUESTIONS.length - 1) {
      setGameState('success');
      setTimeout(() => {
        setCurrentQIndex(prev => prev + 1);
        setPlayerPos(SPAWN_POS);
        setStats(prev => ({ ...prev, timeLeft: 45, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
        setGameState('playing');
        setFeedback({ msg: '', type: null });
      }, 2000);
    } else {
      audioService.playWin();
      setGameState('finished');
    }
  };

  const handleWrongAnswer = () => {
    audioService.playError();
    setFeedback({ msg: "Mauvaise réponse ! Retour au centre.", type: 'bad' });
    setPlayerPos(SPAWN_POS);
    // Penalty?
    setStats(prev => ({ ...prev, score: Math.max(0, prev.score - 5) }));
    setTimeout(() => setFeedback({ msg: '', type: null }), 2000);
  };

  // Render Helpers
  const renderCell = (x: number, y: number) => {
    const isWall = MAZE_GRID[y][x] === 1;
    const isPlayer = playerPos.x === x && playerPos.y === y;
    
    // Check if answer is here
    let answerContent = null;
    let answerClass = '';
    currentQuestion.answers.forEach((ans, idx) => {
      const loc = ANSWER_LOCATIONS[idx % ANSWER_LOCATIONS.length];
      if (loc.x === x && loc.y === y) {
        answerContent = ans.text;
        answerClass = 'bg-yellow-100 border-2 border-yellow-400 text-yellow-800 font-bold text-[10px] md:text-xs flex items-center justify-center text-center leading-none p-1 shadow-md z-10';
      }
    });

    const enemy = enemies.find(e => e.pos.x === x && e.pos.y === y);

    return (
      <div 
        key={`${x}-${y}`} 
        className={`
          w-full h-full relative aspect-square
          ${isWall ? 'bg-slate-800 rounded-sm' : 'bg-slate-200'}
          ${answerClass}
        `}
      >
        {isPlayer && (
          <div className="absolute inset-0 flex items-center justify-center z-20 transition-all duration-200">
            <span className="text-2xl animate-pulse">👨‍🎓</span>
          </div>
        )}
        {enemy && !isPlayer && (
          <div className="absolute inset-0 flex items-center justify-center z-20 transition-all duration-500">
             {enemy.type === 'enemy-atom' && <span className="text-xl">⚛️</span>}
             {enemy.type === 'enemy-molecule' && <span className="text-xl">🧪</span>}
             {enemy.type === 'enemy-electron' && <span className="text-xl">🌀</span>}
          </div>
        )}
        {answerContent && !isPlayer && !enemy && (
          <span className="break-words">{answerContent}</span>
        )}
      </div>
    );
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-4 text-center">
        <h1 className="text-4xl font-bold text-blue-800 mb-6">Le Labyrinthe de la Solubilité</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-md">
          Aide l'élève à traverser le laboratoire ! Réponds correctement aux 10 questions de physique en évitant les particules instables.
        </p>
        <button 
          onClick={startGame}
          className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg transition-transform hover:scale-105"
        >
          <Play fill="currentColor" /> Commencer
        </button>
      </div>
    );
  }

  if (gameState === 'finished') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-4 text-center">
        <Award className="w-24 h-24 text-yellow-500 mb-6" />
        <h1 className="text-4xl font-bold text-green-800 mb-4">Félicitations !</h1>
        <p className="text-xl text-slate-700 mb-2">Tu as maîtrisé la solubilité.</p>
        <div className="bg-white p-6 rounded-xl shadow-md mb-8 w-full max-w-sm">
          <div className="flex justify-between mb-2">
            <span>Score Final:</span>
            <span className="font-bold text-blue-600">{stats.score} pts</span>
          </div>
          <div className="flex justify-between">
            <span>Temps Total:</span>
            <span className="font-bold text-blue-600">{stats.totalTime} sec</span>
          </div>
        </div>
        <button 
          onClick={startGame}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow transition-transform active:scale-95"
        >
          <RotateCcw className="w-5 h-5" /> Rejouer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-100 py-4 px-2">
      {/* HUD */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-4 mb-4">
        <div className="flex justify-between items-center mb-2 text-sm md:text-base">
           <span className="font-bold text-slate-500">Question {stats.currentQuestionIndex} / {QUESTIONS.length}</span>
           <div className="flex items-center gap-2 text-orange-600 font-bold">
             <Clock className="w-4 h-4" /> {stats.timeLeft}s
           </div>
           <span className="font-bold text-blue-600">Score: {stats.score}</span>
        </div>
        <h2 className="text-lg md:text-xl font-bold text-center text-slate-800 leading-tight">
          {currentQuestion.text}
        </h2>
        {feedback.msg && (
          <div className={`mt-2 text-center font-bold p-2 rounded ${feedback.type === 'good' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedback.msg}
          </div>
        )}
      </div>

      {/* Game Board */}
      <div 
        className="bg-white p-2 rounded-lg shadow-xl"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: '100%',
          maxWidth: '600px',
          aspectRatio: '1/1',
          gap: '1px'
        }}
      >
        {MAZE_GRID.map((row, y) => row.map((_, x) => renderCell(x, y)))}
      </div>

      {/* Controls */}
      <Controls onMove={movePlayer} />
      
      {/* Tutorial/Footer */}
      <p className="mt-4 text-xs text-slate-400 text-center max-w-md">
        Utilise les flèches du clavier ou les boutons bleus. Rejoins la case avec la bonne réponse. Évite les atomes !
      </p>
    </div>
  );
};