import { humanReadableTime } from "../utils/time";
import React, { useEffect, useState } from "react";

interface WaitingScreenProps {
  startTime: string;
}

const WaitingScreen: React.FC<WaitingScreenProps> = ({ startTime }) => {
  const [waitingTime, setWaitingTime] = useState<string>("0 seconds");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setWaitingTime(
        humanReadableTime(Date.now() - new Date(startTime).getTime())
      );
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [startTime]);

  return (
    <div>
      <h1>Waiting for a Second Player...</h1>
      <p>Time waiting: {waitingTime}</p>
    </div>
  );
};

export default WaitingScreen;
