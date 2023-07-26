import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { GameSessionService } from './gameSession/gameSessionService';
import { generateMaze } from 'utils/generateMaze';
import {
  GameSession,
  GameSessionStatus,
} from './gameSession/gameSession.model';

@WebSocketGateway({ cors: '*:*' })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private gameSessionService: GameSessionService) {}
  @WebSocketServer()
  server: Server;

  users: { [sessionId: string]: { username: string; clientId: string } } = {};

  handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: any) {
    const sessionId = Object.keys(this.users).find(
      (key) => this.users[key].clientId === client.id,
    );
    if (sessionId) {
      delete this.users[sessionId];
      console.log('Client disconnected:', client.id);
    }
  }

  @SubscribeMessage('login')
  handleLogin(client: any, data: { username: string }) {
    const sessionId = Date.now().toString(); // Generate a unique session ID
    this.users[sessionId] = { username: data.username, clientId: client.id };

    const successResponse = {
      success: true,
      sessionId,
      username: data.username,
    };

    // Send the success response to the client
    client.emit('login', successResponse);
  }

  @SubscribeMessage('createGameSession')
  handleCreateGameSession(
    client: any,
    data: { player1: string; player1Username: string },
  ) {
    const { player1, player1Username } = data;

    // Generate the maze using the generateMaze function (as previously shown)
    const width = 33;
    const height = 31;
    const { finishPosition, maze, player1Position, player2Position } =
      generateMaze(width, height);

    // Create a new game session and get the game session ID
    const gameSession = this.gameSessionService.createGameSession(
      player1,
      player1Username,
      maze,
      finishPosition,
      player1Position,
      player2Position,
    );

    // Send the game session ID back to the client
    client.emit('gameSessionCreated', { ...gameSession });

    // Emit the updated list of game sessions to all clients
    const waitingGameSessions =
      this.gameSessionService.getWaitingGameSessions();
    this.server.emit('waitingGameSessions', waitingGameSessions);
  }

  @SubscribeMessage('getGameSessions')
  getGameSessions(client: any) {
    const waitingGameSessions =
      this.gameSessionService.getWaitingGameSessions();
    this.server.emit('waitingGameSessions', waitingGameSessions);
  }

  @SubscribeMessage('joinGameSession')
  handleJoinGameSession(
    client: any,
    data: { sessionId: string; player2: string; player2Username: string },
  ) {
    const { sessionId, player2, player2Username } = data;
    const gameSession = this.gameSessionService.joinGameSession(
      sessionId,
      player2,
      player2Username,
    );

    if (gameSession) {
      gameSession.gameSessionStatus = GameSessionStatus.IN_PROGRESS;

      // Emit the updated game session to both players
      this.server
        .to(gameSession.player1)
        .emit('joinedGameSession', gameSession);
      this.server
        .to(gameSession.player2)
        .emit('joinedGameSession', gameSession);

      // If the game has started, emit the updated list of game sessions to all clients
      const waitingGameSessions =
        this.gameSessionService.getWaitingGameSessions();
      this.server.emit('waitingGameSessions', waitingGameSessions);

      this.server.emit('gameSessionStatus', {
        sessionId: gameSession.id,
        status: GameSessionStatus.IN_PROGRESS,
      });
    }
  }

  @SubscribeMessage('getGameSessionById')
  async getGameSessionById(
    client: any,
    data: { sessionId: string },
  ): Promise<void> {
    const { sessionId } = data;
    const gameSession = this.gameSessionService.getGameSessionById(sessionId);
    this.server.to(client.id).emit('gameSessionById', gameSession);

    console.log(gameSession);
  }

  @SubscribeMessage('gameSessionCompleted')
  handleGameSessionCompleted(client: any, data: { sessionId: string }) {
    const { sessionId } = data;
    this.gameSessionService.markGameSessionAsCompleted(sessionId);
    const gameSession = this.gameSessionService.getGameSessionById(sessionId);

    client.broadcast.emit('gameSessionUpdated', gameSession);
    client.emit('gameSessionCompleted', gameSession);
  }

  @SubscribeMessage('movePlayer')
  async handleMovePlayer(
    client: any,
    data: { sessionId: string; player: string; direction: [number, number] },
  ) {
    const { sessionId, player, direction } = data;
    const gameSession = this.gameSessionService.getGameSessionById(sessionId);

    // Check if the player can move and update the game session accordingly
    const movedSuccessfully = gameSession.movePlayer(player, direction);

    if (movedSuccessfully) {
      // Emit the initial game session update
      client.emit('gameSessionUpdated', gameSession);
      this.server.emit('gameSessionUpdated', gameSession);

      // Step-by-step movement with promises
      await this.stepByStepMovement(client, gameSession);

      // The movement is completed, emit the final updates and the next player's turn
      if (player === gameSession.player1Username) {
        client.emit('currentTurn', {
          currentPlayer: gameSession.player2Username,
        });
        this.server.emit('currentTurn', {
          currentPlayer: gameSession.player2Username,
        });
      } else {
        client.emit('currentTurn', {
          currentPlayer: gameSession.player1Username,
        });
        this.server.emit('currentTurn', {
          currentPlayer: gameSession.player1Username,
        });
      }
    }
  }

  // Helper function for step-by-step movement with promises
  private async stepByStepMovement(client: any, gameSession: GameSession) {
    const steps = 0; // Adjust this value for the number of steps you want
    const delay = 500; // Adjust the delay as needed

    for (let i = 0; i < steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Emit intermediate updates
      client.emit('gameSessionUpdated', gameSession);
      client.broadcast.emit('gameSessionUpdated', gameSession);
    }
  }

  // Subscribe to the 'surrender' event sent by the client
  @SubscribeMessage('surrender')
  handleSurrender(client: any, data: { sessionId: string; playerId: string }) {
    const { sessionId, playerId } = data;
    const gameSession = this.gameSessionService.getGameSessionById(sessionId);

    // Handle player surrender
    gameSession.surrender(playerId);

    this.server.emit('gameSessionCompleted', gameSession);
    client.emit('gameSessionCompleted', gameSession);
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(
    client: any,
    data: {
      message: string;
      timestamp: Date;
      sender: string;
      sessionId: string;
    },
  ) {
    // Check if the message is a movement command
    if (data.message.startsWith('/')) {
      const command = data.message.slice(1).toLowerCase();
      switch (command) {
        case 'up':
          this.handleMovePlayer(client, {
            sessionId: data.sessionId,
            player: data.sender,
            direction: [0, -1],
          });
          this.server.emit('movementMade', {
            player: data.sender,
            direction: [0, -1],
          });
          break;
        case 'down':
          this.handleMovePlayer(client, {
            sessionId: data.sessionId,
            player: data.sender,
            direction: [0, 1],
          });
          this.server.emit('movementMade', {
            player: data.sender,
            direction: [0, 1],
          });
          break;
        case 'left':
          this.handleMovePlayer(client, {
            sessionId: data.sessionId,
            player: data.sender,
            direction: [-1, 0],
          });
          this.server.emit('movementMade', {
            player: data.sender,
            direction: [-1, 0],
          });
          break;
        case 'right':
          this.handleMovePlayer(client, {
            sessionId: data.sessionId,
            player: data.sender,
            direction: [1, 0],
          });
          this.server.emit('movementMade', {
            player: data.sender,
            direction: [1, 0],
          });
          break;
        default:
          // Ignore other commands
          break;
      }
    } else {
      // Broadcast the chat message to all connected clients except the sender
      client.broadcast.emit('chatMessage', data);

      // Also send the chat message back to the sender
      client.emit('chatMessage', data);
    }
  }
}
