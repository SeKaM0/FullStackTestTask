import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onMessage, emitMessage } from "../utils/socket";
import GameListCard from "../components/GameListCard";
import { GameSession } from "../types/type";
import Button from "../components/ButtonComponent";

const Dashboard: React.FC = () => {
  const [gameSessions, setGameSessions] = useState<GameSession[]>([]);

  const sessionId = localStorage.getItem("sessionId");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    emitMessage("getGameSessions", (data: GameSession[]) => {
      setGameSessions(data);
    });

    onMessage("gameSessionCreated", (data: GameSession) => {
      setGameSessions((prevSessions) => [...prevSessions, data]);
      if (data && data.id) {
        navigate(`/game/${data.id}`);
      }
    });

    onMessage("waitingGameSessions", (data: GameSession[]) => {
      setGameSessions(data);
    });
  }, []);

  const handleCreateGameSession = () => {
    emitMessage("createGameSession", {
      player1: sessionId,
      player1Username: username,
    });
  };

  const activeGames = gameSessions.filter(
    (session) => session.player2 === null
  );

  const handleJoinGame = (gameSessionId: string) => {
    const gameSession = gameSessions.find(
      (session) => session.id === gameSessionId
    );
    if (gameSession) {
      if (gameSession.player2 === null) {
        navigate(`/game/${gameSessionId}`);
      }
      emitMessage("joinGameSession", {
        sessionId: gameSessionId,
        player2: sessionId,
        player2Username: username,
      });
    }
  };
  return (
    <div className="flex p-4 flex-col justify-center">
      <div className="flex items-center justify-between">
        <h2 className="flex text-gray-900 font-semibold text-center text-2xl">
          Hello, {username}!
        </h2>

        <h1 className="flex text-gray-900 font-semibold text-center text-2xl">
          Dashboard
        </h1>

        <div className="flex self-end">
          <Button title="New Game" onClick={handleCreateGameSession} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col pt-10 items-center w-[1024px]">
          <h2 className="flex text-gray-900 font-semibold text-center text-2xl">
            Waiting Games
          </h2>
          <div className="flex flex-col w-full gap-3 pt-3">
            {activeGames.length > 0 &&
              activeGames.map(
                (session) =>
                  session && (
                    <GameListCard
                      key={session.id}
                      gameSession={session}
                      onJoin={handleJoinGame}
                    />
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
