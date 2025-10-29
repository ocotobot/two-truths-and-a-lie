export type Topic = 'Animals' | 'Art' | 'Food' | 'Geography' | 'History' | 'Literature' | 'Movies' | 'Music' | 'Nature' | 'Science' | 'Space' | 'Sports' | 'Technology';

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
