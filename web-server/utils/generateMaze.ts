export function generateMaze(
  width: number,
  height: number,
): {
  maze: string[][];
  player1Position: [number, number];
  player2Position: [number, number];
  finishPosition: [number, number];
} {
  // Initialize the maze grid with walls
  const maze: string[][] = new Array<string[]>(height);
  for (let i = 0; i < height; i++) {
    maze[i] = new Array<string>(width).fill('#');
  }

  // Recursive Backtracking algorithm
  function backtrack(x: number, y: number): void {
    maze[y][x] = ' '; // Mark the current cell as empty

    // Define the order of neighboring cells to visit randomly
    const directions: [number, number][] = [
      [1, 0], // right
      [-1, 0], // left
      [0, 1], // down
      [0, -1], // up
    ];
    shuffleArray(directions);

    // Explore each neighboring cell
    for (const [dx, dy] of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;

      if (
        nx >= 0 &&
        nx < width &&
        ny >= 0 &&
        ny < height &&
        maze[ny][nx] === '#'
      ) {
        // Check if the neighboring cell is a wall
        // If so, remove the wall and recursively backtrack from there
        maze[y + dy][x + dx] = ' '; // Remove the wall
        backtrack(nx, ny);
      }
    }
  }

  // Start the maze generation from a random cell
  const start_x = getRandomOddNumber(width);
  const start_y = getRandomOddNumber(height);

  backtrack(start_x, start_y);

  // Place the players at random empty cells
  const player1Position = getRandomEmptyCell(width, height);
  const player2Position = getRandomEmptyCell(width, height);

  // Generate the finish position
  const finishPosition = getRandomEmptyCell(width, height);

  // Assign player positions and finish position to the maze
  maze[player1Position[1]][player1Position[0]] = 'P1';
  maze[player2Position[1]][player2Position[0]] = 'P2';
  maze[finishPosition[1]][finishPosition[0]] = 'F';

  return {
    maze,
    player1Position,
    player2Position,
    finishPosition,
  };
}

// Rest of the code remains the same

// Helper function to shuffle an array in place
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Helper function to get a random odd number within a range
function getRandomOddNumber(max: number): number {
  const number = Math.floor(Math.random() * max);
  return number % 2 === 0 ? number + 1 : number;
}

// Helper function to get a random empty cell in the maze
function getRandomEmptyCell(width: number, height: number): [number, number] {
  const x = getRandomOddNumber(width);
  const y = getRandomOddNumber(height);
  return [x, y];
}
