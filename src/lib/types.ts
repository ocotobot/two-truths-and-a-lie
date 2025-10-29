export type Topic = 'Animals' | 'History' | 'Space' | 'Food' | 'Sports' | 'Movies' | 'Science' | 'Geography';

export interface Statement {
  text: string;
  isLie: boolean;
  explanation: string;
}

export interface GameRound {
  topic: string;
  statements: Statement[];
}

export interface Score {
  correct: number;
  incorrect: number;
}

export type GameState = 'topic-selection' | 'playing' | 'revealed';
