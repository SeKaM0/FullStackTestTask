import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import WaitingScreen from "../components/WaitingScreen";
import Maze from "../components/Maze";
import { GameSession, GameSessionStatus } from "../types/type";
import { emitMessage, getGameSessionById, onMessage } from "../utils/socket";
import Input from "../components/Input";
import Button from "../components/ButtonComponent";
import { formatTime } from "../utils/time";
import { getDirectionName } from "../utils";

const GameSessionPage: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const username = localStorage.getItem("username");
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState<string>(
    username as string
  );
  const [chatMessages, setChatMessages] = useState<
    { message: string; timestamp: Date; sender: string }[]
  >([]);

  const [winner, setWinner] = useState<string | null>(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const movementInProgress = useRef(false);
  useEffect(() => {
    getGameSessionById(sessionId as string, (data: GameSession) => {
      setGameSession(data);
      setLoading(false);
    });
    onMessage("gameSessionUpdated", (data: GameSession) => {
      setGameSession(data);
    });

    onMessage("currentTurn", (data: { currentPlayer: string }) => {
      setCurrentPlayer(data.currentPlayer);
    });

    onMessage(
      "chatMessage",
      (data: { message: string; timestamp: Date; sender: string }) => {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { message: data.message, timestamp: new Date(), sender: data.sender },
        ]);
      }
    );
    onMessage(
      "movementMade",
      (data: {
        player: string;
        sender: string;
        direction: [number, number];
      }) => {
        const { player, direction } = data;
        const directionName = getDirectionName(direction[0], direction[1]);
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            message: `(${player} is moving ${directionName})`,
            timestamp: new Date(),
            sender: "",
          },
        ]);
      }
    );
    onMessage(
      "gameSessionStatus",
      (data: { sessionId: string; status: string }) => {
        if (
          data.sessionId === sessionId &&
          data.status === GameSessionStatus.IN_PROGRESS
        ) {
          location.reload();
        }
      }
    );
    onMessage("gameSessionCompleted", (data: GameSession) => {
      const { winnerUsername } = data;
      console.log(data);

      setGameFinished(true);
      setWinner(winnerUsername);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        {
          message: `Game Over! ${winnerUsername || ""} wins!`,
          timestamp: new Date(),
          sender: "",
        },
      ]);
    });
  }, [sessionId, username]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameSession || currentPlayer !== username) return;
      const emitMovePlayer = (dx: number, dy: number) => {
        if (currentPlayer === username && gameSession) {
          const data = {
            sessionId: gameSession.id,
            player: username,
            direction: [dx, dy],
          };
          emitMessage("movePlayer", data);
        }
      };
      if (gameSession.gameSessionStatus === GameSessionStatus.IN_PROGRESS) {
        if (movementInProgress.current) {
          return;
        }

        const LEFT_ARROW_KEY = 37;
        const UP_ARROW_KEY = 38;
        const RIGHT_ARROW_KEY = 39;
        const DOWN_ARROW_KEY = 40;

        switch (event.keyCode) {
          case LEFT_ARROW_KEY:
            emitMovePlayer(-1, 0);
            break;
          case UP_ARROW_KEY:
            emitMovePlayer(0, -1);
            break;
          case RIGHT_ARROW_KEY:
            emitMovePlayer(1, 0);
            break;
          case DOWN_ARROW_KEY:
            emitMovePlayer(0, 1);
            break;
          default:
            return;
        }
        if (event.key === "/" && !movementInProgress.current) {
          event.preventDefault();
          setInputMessage("/");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sessionId, username, gameSession, currentPlayer]);
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    emitMessage("chatMessage", {
      message: inputMessage,
      timestamp: new Date(),
      sender: username,
      sessionId: gameSession?.id,
    });

    setInputMessage("");
  };
  const handleSurrender = () => {
    emitMessage("surrender", { sessionId, playerId: username });
  };
  const renderGameScreen = (gameSession: GameSession | null) => {
    if (!gameSession) {
      return null;
    }

    if (gameSession.gameSessionStatus === GameSessionStatus.WAITING) {
      return <WaitingScreen startTime={gameSession.createdAt} />;
    } else if (
      gameSession.gameSessionStatus === GameSessionStatus.IN_PROGRESS
    ) {
      return (
        <div className="flex">
          <div className="flex-1 mr-4">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {/* Place the maze component here */}
                <Maze
                  maze={gameSession?.maze}
                  player1Position={gameSession?.player1Position}
                  player2Position={gameSession?.player2Position}
                  finishPosition={gameSession?.finishPosition}
                  currentPlayer={currentPlayer}
                />
              </>
            )}
          </div>
          <div className="flex-1">
            <div className="h-full border rounded p-4">
              <div className="h-[600px] overflow-y-auto">
                {chatMessages.map((messageData, index) => (
                  <div key={index} className="mb-2">
                    <div className="mb-1">{`${
                      messageData.sender.length > 0
                        ? messageData.sender + ":"
                        : messageData.sender
                    } ${messageData.message}`}</div>
                    <div className="text-xs text-gray-500">
                      {formatTime(messageData.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <Input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage} title="Send" />
              </div>
              {gameSession?.gameSessionStatus ===
                GameSessionStatus.IN_PROGRESS && (
                <Button
                  classes="mt-2 bg-red-500 border-red-600 hover:bg-red-500"
                  onClick={handleSurrender}
                  title="Surrender"
                  fullWidth
                />
              )}
              {gameFinished && <div>Winner: {winner}</div>}
            </div>
          </div>
        </div>
      );
    } else {
      return <div>Error: Invalid Game Session</div>;
    }
  };

  return (
    <div>{loading ? <div>Loading...</div> : renderGameScreen(gameSession)}</div>
  );
};

export default GameSessionPage;
