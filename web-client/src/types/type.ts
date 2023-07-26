export enum GameSessionStatus {
  WAITING = "waiting",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}

export interface GameSession {
  id: string;
  player1: string;
  player1Username: string;
  winnerUsername: string | null;
  player2: string | null;
  player2Username: string | null;
  maze: string[][];
  finishPosition: [number, number];
  player1Position: [number, number];
  player2Position: [number, number];
  createdAt: string;
  gameSessionStatus: GameSessionStatus;
}
