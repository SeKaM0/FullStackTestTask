interface MazeProps {
  maze: string[][];
  player1Position: [number, number];
  player2Position: [number, number];
  finishPosition: [number, number];
  currentPlayer: string;
}

const Maze: React.FC<MazeProps> = ({
  maze,
  player1Position,
  player2Position,
  finishPosition,
  currentPlayer,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mt-8 mb-4">Maze Game</h1>
      <div className="flex justify-center">
        <div className="border border-gray-300 p-2">
          {maze.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((cell, cellIndex) => {
                const isPlayer1: boolean =
                  player1Position[0] === cellIndex &&
                  player1Position[1] === rowIndex;
                const isPlayer2: boolean =
                  player2Position[0] === cellIndex &&
                  player2Position[1] === rowIndex;
                const isFinish: boolean =
                  finishPosition[0] === cellIndex &&
                  finishPosition[1] === rowIndex;
                return (
                  <div
                    key={cellIndex}
                    className={`w-6 h-6 flex items-center justify-center border ${
                      cell === "#"
                        ? "bg-black border-black"
                        : "bg-white border-gray-300"
                    } ${isFinish ? "!bg-green-500" : ""}`}
                  >
                    {isPlayer1 && (
                      <div className="bg-blue-500 w-full h-full flex items-center justify-center text-white">
                        P1
                      </div>
                    )}
                    {isPlayer2 && (
                      <div className="bg-red-500 w-full h-full flex items-center justify-center text-white">
                        P2
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        {
          <>
            <h2 className="text-lg font-semibold">Current Turn:</h2>
            <p className="text-xl">{`Player ${currentPlayer}`}</p>
          </>
        }
      </div>
    </div>
  );
};

export default Maze;
