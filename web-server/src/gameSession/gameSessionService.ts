import { Injectable, NotFoundException } from '@nestjs/common';
import { GameSession, GameSessionStatus } from './gameSession.model';

@Injectable()
export class GameSessionService {
  private gameSessions: GameSession[] = [];

  createGameSession(
    player1: string,
    player1Username: string,
    maze: string[][],
    finishPosition: [number, number],
    player1Position: [number, number],
    player2Position: [number, number],
  ): GameSession {
    const id = Date.now().toString();
    const createdAt = new Date();
    const gameSession = new GameSession(
      id,
      player1,
      player1Username,
      maze,
      finishPosition,
      player1Position,
      player2Position,
      createdAt,
    );
    this.gameSessions.push(gameSession);
    return gameSession;
  }

  getWaitingGameSessions(): GameSession[] {
    return this.gameSessions.filter((gameSession) => !gameSession.player2);
  }

  joinGameSession(
    sessionId: string,
    player2: string,
    player2Username: string,
  ): GameSession {
    const gameSession = this.gameSessions.find(
      (gameSession) => gameSession.id === sessionId,
    );
    if (gameSession) {
      gameSession.player2 = player2;
      gameSession.player2Username = player2Username;
    }
    return gameSession;
  }

  getGameSessionById(sessionId: string): GameSession {
    const gameSession = this.gameSessions.find(
      (gameSession) => gameSession.id === sessionId,
    );
    if (!gameSession) {
      throw new NotFoundException('Game session not found.');
    }
    return gameSession;
  }

  markGameSessionAsCompleted(sessionId: string): boolean {
    const gameSessionIndex = this.gameSessions.findIndex(
      (session) => session.id === sessionId,
    );

    if (gameSessionIndex !== -1) {
      const gameSession = this.gameSessions[gameSessionIndex];
      if (gameSession.gameSessionStatus !== GameSessionStatus.COMPLETED) {
        gameSession.gameSessionStatus = GameSessionStatus.COMPLETED;
        // Implement logic to determine the winner and set the winnerUsername property
        // For example, if player1 wins:
        gameSession.winnerUsername = gameSession.player1Username;
        // Or if player2 wins:
        // gameSession.winnerUsername = gameSession.player2Username;

        // Return true to indicate success
        return true;
      }
    }

    // Return false if the game session was not found or is already completed
    return false;
  }
}
