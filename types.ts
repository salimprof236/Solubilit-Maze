export interface Position {
  x: number;
  y: number;
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
  explanation?: string;
}

export type EntityType = 'player' | 'enemy-atom' | 'enemy-electron' | 'enemy-molecule';

export interface Enemy {
  id: number;
  pos: Position;
  type: EntityType;
}

export type GameState = 'menu' | 'playing' | 'success' | 'failure' | 'finished';

export interface GameStats {
  score: number;
  timeLeft: number;
  currentQuestionIndex: number;
  totalTime: number;
}