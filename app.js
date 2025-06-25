var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Game } from "./components/Game.js";
import { Player } from "./components/Player.js";
import { AI } from "./components/AI.js";
// Global player variable
let game;
let player;
let opponent;
// Create a new game as creator (with AI or wait for opponent)
function createGame(creatorName, boardNumber = 1, playerTimerPerBoard = 2 * 60) {
    player = new Player(creatorName, true); // Set global player
    const game = new Game(player, boardNumber, playerTimerPerBoard);
    return game;
}
// Join an existing game as opponent
function joinGame(game, opponentName) {
    player = new Player(opponentName, false); // Set global player
    game.opponent = player;
}
// To add an AI opponent:
function addAIOpponent(game) {
    opponent = new AI("Computer", false, "easy");
    game.addOpponent(opponent);
}
function renderBoard(board, player, container) {
    var _a;
    container.innerHTML = "";
    const boardDiv = document.createElement("div");
    boardDiv.id = board.boardId;
    boardDiv.className = `
    grid grid-cols-3 gap-2
    w-full aspect-square
    max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
    mx-auto mt-10
  `.replace(/\s+/g, " ");
    boardDiv.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("button");
        cell.className = `
      w-full aspect-square
      bg-gray-200 rounded
      text-3xl sm:text-4xl md:text-5xl lg:text-6xl
      font-bold
      flex items-center justify-center
      transition hover:bg-blue-100
    `.replace(/\s+/g, " ");
        cell.textContent = (_a = board.cells[i]) !== null && _a !== void 0 ? _a : "";
        cell.dataset.index = i.toString();
        // Only allow click if cell is empty and board is not won
        if (!board.cells[i] && !board.boardWinner) {
            cell.onclick = () => {
                player.onClick(board, i);
                player.updateBoards(game.boards);
            };
        }
        boardDiv.appendChild(cell);
    }
    container.appendChild(boardDiv);
}
// --- Example usage ---
let boardsContainer = document.getElementById("boards-container");
if (!boardsContainer) {
    boardsContainer = document.createElement("div");
    boardsContainer.id = "boards-container";
    boardsContainer.className = "w-full flex flex-wrap gap-6 justify-center";
    document.body.appendChild(boardsContainer);
}
// Create game (no opponent yet)
game = createGame("You", 3, 3 * 60);
// Add AI opponent when ready:
addAIOpponent(game);
// Helper to wait for either a click or timeout
function waitForPlayerMove(board, player, container, remainTimeMs) {
    return new Promise((resolve) => {
        let resolved = false;
        renderBoard(board, player, container);
        // Attach click listeners
        const boardDiv = document.getElementById(board.boardId);
        if (boardDiv) {
            for (let i = 0; i < 9; i++) {
                const cell = boardDiv.querySelector(`button[data-index="${i}"]`);
                if (cell && !board.cells[i] && !board.boardWinner) {
                    cell.onclick = () => {
                        if (!resolved) {
                            player.onClick(board, i);
                            player.updateBoards(game.boards);
                            resolved = true;
                            resolve("clicked");
                        }
                    };
                }
            }
        }
        // Set timeout for remainTimeMs
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                resolve("timeout");
            }
        }, remainTimeMs);
    });
}
// Usage in your game loop (async function)
function startGameLoop(boardsContainer) {
    return __awaiter(this, void 0, void 0, function* () {
        game.startGame();
        player.updateBoards(game.boards);
        if (opponent) {
            opponent.updateBoards(game.boards);
        }
        while (game.status === "started") {
            if (player.boards.length > 0) {
                const currentBoard = player.boards[0];
                // Use the correct remain time for the player
                const remainTimeMs = player.symbol === "X"
                    ? currentBoard.creatorRemainTime
                    : currentBoard.opponentRemainTime;
                const result = yield waitForPlayerMove(currentBoard, player, boardsContainer, remainTimeMs);
                if (result === "timeout") {
                    alert("Time's up! Turn skipped or handle timeout logic here.");
                    // Optionally, handle skipping turn or ending game
                }
                player.updateBoards(game.boards);
                if (opponent)
                    opponent.updateBoards(game.boards);
            }
            else if (opponent instanceof AI && opponent.boards.length > 0) {
                const opponentBoard = opponent.boards[0];
                renderBoard(opponentBoard, opponent, boardsContainer);
                yield opponent.makeMove(opponentBoard); // Await AI move
                opponent.updateBoards(game.boards);
                player.updateBoards(game.boards);
            }
            else {
                // No move available, wait a bit
                yield new Promise((res) => setTimeout(res, 100));
            }
            // Check for game end after each move
            if (game.status !== "started")
                break;
        }
        alert("Game over!");
    });
}
// Call this to start the loop
startGameLoop(boardsContainer);
