// gameSession.model.ts
export enum GameSessionStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export class GameSession {
  id: string;
  player1: string;
  player1Username: string;
  player2Username: string;
  player2: string | null;
  maze: string[][];
  finishPosition: [number, number];
  player1Position: [number, number];
  player2Position: [number, number];
  createdAt: Date;
  gameSessionStatus: GameSessionStatus;
  gameFinished: boolean;
  winnerUsername: string | null;

  constructor(
    id: string,
    player1: string,
    player1Username: string,
    maze: string[][],
    finishPosition: [number, number],
    player1Position: [number, number],
    player2Position: [number, number],
    createdAt: Date,
  ) {
    this.id = id;
    this.player1 = player1;
    this.player1Username = player1Username;
    this.player2 = null;
    this.player2Username = null;
    this.maze = maze;
    this.finishPosition = finishPosition;
    this.player1Position = player1Position;
    this.player2Position = player2Position;
    this.createdAt = createdAt;
    this.gameSessionStatus = GameSessionStatus.WAITING;
    this.gameFinished = false;
    this.winnerUsername = null;
  }

  movePlayer(player: string, direction: [number, number]): boolean {
    if (this.gameFinished) return false;

    const currentPlayerPosition =
      player === this.player1Username
        ? this.player1Position
        : this.player2Position;
    const newPosition: [number, number] = [
      currentPlayerPosition[0] + direction[0],
      currentPlayerPosition[1] + direction[1],
    ];

    if (this.maze[newPosition[1]][newPosition[0]] !== '#') {
      if (player === this.player1Username) {
        this.player1Position = newPosition;
      } else {
        this.player2Position = newPosition;
      }

      if (
        newPosition[0] === this.finishPosition[0] &&
        newPosition[1] === this.finishPosition[1]
      ) {
        this.gameFinished = true;
        this.winnerUsername = player;
        this.gameSessionStatus = GameSessionStatus.COMPLETED;
      }

      return true;
    }

    return false;
  }

  surrender(playerId: string): void {
    if (!this.gameFinished) {
      this.gameFinished = true;
      this.gameSessionStatus = GameSessionStatus.COMPLETED;
      this.winnerUsername =
        playerId === this.player1Username
          ? this.player2Username
          : this.player1Username;
    }
  }
}
