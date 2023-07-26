Sure, here's the README.md formatted version:

# FullStackTestTask

This is a full-stack test task project that includes both a web client and a web server. The application allows users to play a multiplayer maze game, where they can compete against each other to find their way through a maze.

## Getting Started

### Web Client

1. Navigate to the web-client folder:

```bash
cd web-client
```

2. Install the dependencies using Yarn or npm:

```bash
yarn
```
or
```bash
npm install
```

3. Start the web client development server:

```bash
yarn dev
```

The web client development server will run, and the application will be available at `http://localhost:3000`.

### Web Server

1. Navigate to the web-server folder:

```bash
cd web-server
```

2. Install the dependencies using Yarn or npm:

```bash
yarn
```
or
```bash
npm install
```

3. Start the web server:

```bash
yarn start
```

The web server will start running on the specified port, and the multiplayer maze game will be accessible at `http://localhost:<port>`.

## How to Play

1. Access the application in your web browser:

Open your web browser and go to `http://localhost:3000` (if running the client in development mode) or `http://localhost:<port>` (if running the client and server separately).

2. On the homepage, you will be prompted to enter your username. Enter a unique username and click "Start."

3. The game will then display a list of waiting game sessions. If no game sessions are available, you can create one by clicking the "Create Game" button.

4. If there are available game sessions, click on the "Join" button next to the game session you want to participate in.

5. Once the game session is full with two players, the maze game will start.

6. Use the arrow keys to move your player in the maze. The objective is to find your way to the exit of the maze before your opponent.

7. You can also use commands like `/up`, `/down`, `/left`, and `/right` to move your player in the maze.

8. The game will notify you when it's your turn to move.

9. The first player to reach the exit of the maze will be declared the winner.

10. You can also use the chat to communicate with your opponent during the game.

## Contributing

Contributions to this project are welcome! If you encounter any issues or have ideas for improvements, please feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
