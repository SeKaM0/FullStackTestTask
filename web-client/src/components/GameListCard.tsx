import React from "react";
import { GameSession } from "../types/type";
import Button from "./ButtonComponent";

interface GameListCardProps {
  gameSession: GameSession;
  onJoin: (sessionId: string) => void;
}

const GameListCard: React.FC<GameListCardProps> = ({ gameSession, onJoin }) => {
  const handleJoinClick = () => {
    onJoin(gameSession.id);
  };

  return (
    <div className="group flex border items-center border-gray-400 p-2 rounded-md w-full justify-between hover:border-blue-600 cursor-pointer">
      <h3 className="text-gray-900 group-hover:text-blue-600 font-medium text-lg">
        {gameSession.player1Username}'s Game
      </h3>
      <Button onClick={handleJoinClick}>Join</Button>
    </div>
  );
};

export default GameListCard;
