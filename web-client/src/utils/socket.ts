import { GameSession } from "@/types/type";
import { io, Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3001"; // Replace with your actual server URL

const socket: Socket = io(SOCKET_SERVER_URL, {
  autoConnect: false, // Prevent automatic connection
});

socket.connect();

export const emitMessage = (event: string, data: any) => {
  socket.emit(event, data);
};

export const onMessage = (event: string, callback: (data: any) => void) => {
  socket.on(event, callback);

  return () => {
    socket.off(event, callback);
  };
};

export const getGameSessionById = (
  sessionId: string,
  callback: (data: GameSession) => void
): void => {
  emitMessage("getGameSessionById", { sessionId });
  onMessage("gameSessionById", (data: GameSession) => {
    callback(data);
  });
};
