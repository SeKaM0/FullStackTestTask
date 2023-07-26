import React, { useState, useEffect } from "react";
import { GameSession } from "../types/type";
import { humanReadableTime } from "../utils/time";

interface WaitingGameCardProps {
  gameSession: GameSession;
}

const WaitingGameCard: React.FC<WaitingGameCardProps> = ({ gameSession }) => {
  const [timeInterval, setTimeInterval] = useState<string>("");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeInterval(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        humanReadableTime(
          Date.now() - new Date(gameSession.createdAt).getTime()
        )
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [gameSession.createdAt]);

  return (
    <div>
      <h3>
        You started a new game {timeInterval} ago. Waiting for a second
        player...
      </h3>
      <p>
        Date/Time of Initiation:{" "}
        {new Date(gameSession.createdAt).toLocaleString()}
      </p>
      <p>Initiated by: {gameSession.player1Username}</p>
      {/* Optionally, you can add a button to join the game */}
      {/* <button onClick={() => handleJoinGameSession(gameSession.id)}>Join</button> */}
    </div>
  );
};

export default WaitingGameCard;
