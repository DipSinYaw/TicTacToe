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
let game;
let player;
let opponent;
let timerBoard;
let playersTimer = null;
// --- Utility ---
// function formatTimer(seconds: number) {
//   const m = Math.floor(seconds / 60)
//     .toString()
//     .padStart(2, "0");
//   const s = Math.floor(seconds % 60)
//     .toString()
//     .padStart(2, "0");
//   console.log(`Formatted timer: ${m}:${s}`);
//   return `${m}:${s}`;
// }
function countTimer(board, document) {
    var _a;
    let currentSymbol = (_a = board.currentTurn) === null || _a === void 0 ? void 0 : _a.symbol;
    let turnStartTime = board.startTurnTime;
    let msec = currentSymbol === "X" ? board.creatorRemainTime : board.opponentRemainTime;
    if (typeof turnStartTime === "number") {
        const msecElapsed = Date.now() - turnStartTime;
        msec -= msecElapsed;
    }
    else {
        msec = 0;
    }
    const m = Math.floor(msec / 60 / 1000)
        .toString()
        .padStart(2, "0");
    const s = Math.floor(msec / 1000)
        .toString()
        .padStart(2, "0");
    const ms = Math.floor(msec % 1000)
        .toString()
        .padStart(2, "0");
    const time = `${m}:${s}:${ms}`;
    if (document) {
        if (currentSymbol === "X") {
            const player1Timer = document.getElementById("player1-timer");
            if (player1Timer) {
                player1Timer.textContent = time;
            }
        }
        else if (currentSymbol === "O") {
            const player2Timer = document.getElementById("player2-timer");
            if (player2Timer) {
                player2Timer.textContent = time;
            }
        }
    }
}
// --- Game Setup ---
function createGame(creatorName, boardNumber = 1, playerTimerPerBoard = 2 * 60) {
    player = new Player(creatorName, true);
    return new Game(player, boardNumber, playerTimerPerBoard);
}
function addAIOpponent(game) {
    opponent = new AI("Computer", false, "easy");
    game.addOpponent(opponent);
}
function getTitleDiv() {
    // Title
    const titleDiv = document.createElement("div");
    titleDiv.className = "text-center mb-6";
    titleDiv.innerHTML = `<h1 class="text-4xl sm:text-5xl font-extrabold text-blue-800 tracking-tight leading-tight">Tic-Tac-Toe Game</h1>`;
    return titleDiv;
}
function getInfoDiv(board) {
    var _a;
    const topDiv = document.createElement("div");
    topDiv.className = "mb-6";
    const infoRow = document.createElement("div");
    infoRow.className =
        "grid grid-cols-[1fr_2fr] items-stretch mb-0 gap-x-2 w-full";
    const leftDiv = document.createElement("div");
    leftDiv.className = "text-center flex flex-col items-center flex-shrink-0";
    leftDiv.innerHTML = `
    <p class="text-sm text-gray-500 mb-1">LEVEL 1</p>
    <p class="text-6xl font-extrabold text-gray-800">${(_a = board.boardId.split("-").pop()) !== null && _a !== void 0 ? _a : 1}</p>
  `;
    const rightDiv = document.createElement("div");
    rightDiv.className = "flex flex-col gap-y-1";
    rightDiv.innerHTML = `
    <div class="text-center border-2 border-solid border-blue-600 px-3 py-1 rounded">
      <div class="flex items-center justify-center gap-x-2 w-full">
        <p class="text-base sm:text-lg md:text-xl font-semibold text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis flex-grow min-w-0" title="${player.name}">${player.name}</p>
        <p class="text-lg text-gray-700 flex-shrink-0"><span id="player1-timer"></span></p>
      </div>
    </div>
    <div class="text-center border-2 border-solid border-green-600 px-3 py-1 rounded">
      <div class="flex items-center justify-center gap-x-2 w-full">
        <p class="text-base sm:text-lg md:text-xl font-semibold text-green-600 whitespace-nowrap overflow-hidden text-ellipsis flex-grow min-w-0" title="${(opponent && opponent.name) || "AI"}">${(opponent && opponent.name) || "AI"}</p>
        <p class="text-lg text-gray-700 flex-shrink-0"><span id="player2-timer"></span></p>
      </div>
    </div>
  `;
    infoRow.appendChild(leftDiv);
    infoRow.appendChild(rightDiv);
    topDiv.appendChild(infoRow);
    return topDiv;
}
function getBoardDiv(board, player, container) {
    var _a;
    // Board Grid
    const boardDiv = document.createElement("div");
    boardDiv.id = board.boardId;
    boardDiv.className = `
    grid grid-cols-3 gap-2
    w-full aspect-square
    max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
    mx-auto
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
        if (!board.cells[i] && !board.boardWinner) {
            cell.onclick = () => {
                player.onClick(board, i);
                player.updateBoards(game.boards);
                renderBoard(board, player, container);
            };
        }
        boardDiv.appendChild(cell);
    }
    return boardDiv;
}
function renderBoard(board, player, container) {
    container.innerHTML = "";
    const cardDiv = document.createElement("div");
    cardDiv.className =
        "bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] aspect-[3/5] mx-auto flex flex-col items-stretch";
    cardDiv.appendChild(getTitleDiv());
    cardDiv.appendChild(getInfoDiv(board));
    cardDiv.appendChild(getBoardDiv(board, player, container));
    container.appendChild(cardDiv);
}
// --- DOM Setup ---
let boardsContainer = document.getElementById("boards-container");
if (!boardsContainer) {
    console.log("Creating boards container");
    boardsContainer = document.createElement("div");
    boardsContainer.id = "boards-container";
    boardsContainer.className = "w-full flex flex-wrap gap-6 justify-center";
    document.body.appendChild(boardsContainer);
}
game = createGame("You", 1, 3 * 60);
timerBoard = game.boards[0];
addAIOpponent(game);
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
        // let displayBoard = game.boards[0];
        while (game.status === "started") {
            if (player.boards.length > 0) {
                const currentBoard = player.boards[0];
                // displayBoard = currentBoard;
                // Use the correct remain time for the player
                const remainTimeMs = player.symbol === "X"
                    ? currentBoard.creatorRemainTime
                    : currentBoard.opponentRemainTime;
                const result = yield waitForPlayerMove(currentBoard, player, boardsContainer, remainTimeMs);
                if (result === "timeout") {
                    alert("Time's up! Turn skipped or handle timeout logic here.");
                    // Optionally, handle skipping turn or ending game
                }
                game.getWinner();
                player.updateBoards(game.boards);
                if (opponent)
                    opponent.updateBoards(game.boards);
                renderBoard(currentBoard, player, boardsContainer);
            }
            else if (opponent instanceof AI && opponent.boards.length > 0) {
                const opponentBoard = opponent.boards[0];
                // displayBoard = opponentBoard;
                renderBoard(opponentBoard, opponent, boardsContainer);
                yield opponent.makeMove(opponentBoard); // Await AI move
                game.getWinner();
                opponent.updateBoards(game.boards);
                player.updateBoards(game.boards);
                renderBoard(opponentBoard, opponent, boardsContainer);
            }
            else {
                // No move available, wait a bit
                yield new Promise((res) => setTimeout(res, 100));
            }
            // Check for game end after each move
            if (game.status !== "started")
                break;
        }
        yield new Promise((res) => setTimeout(res, 100));
        alert("Game over!");
    });
}
// Call this to start the loop
startGameLoop(boardsContainer);
setImmediate(() => {
    if (timerBoard) {
        setInterval(() => {
            countTimer(timerBoard, document);
        }, 100);
    }
});
