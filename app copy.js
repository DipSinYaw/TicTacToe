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
let timerIntervalId = undefined;
let timerBoard;
let playersTimer = null;
function updateBothTimers(board, document) {
    var _a, _b;
    // Calculate X (player) time
    let xMsec = board.creatorRemainTime;
    if (((_a = board.currentTurn) === null || _a === void 0 ? void 0 : _a.symbol) === "X" &&
        typeof board.startTurnTime === "number") {
        xMsec -= Date.now() - board.startTurnTime;
    }
    xMsec = Math.max(0, xMsec);
    // Calculate O (opponent/AI) time
    let oMsec = board.opponentRemainTime;
    if (((_b = board.currentTurn) === null || _b === void 0 ? void 0 : _b.symbol) === "O" &&
        typeof board.startTurnTime === "number") {
        oMsec -= Date.now() - board.startTurnTime;
    }
    oMsec = Math.max(0, oMsec);
    // Format
    const format = (msec) => {
        const minutes = Math.floor(msec / 60000)
            .toString()
            .padStart(2, "0");
        const seconds = Math.floor((msec % 60000) / 1000)
            .toString()
            .padStart(2, "0");
        const millis = Math.floor(msec % 1000)
            .toString()
            .padStart(3, "0");
        return `${minutes}:${seconds}:${millis}`;
    };
    // Update UI
    const player1Timer = document.getElementById("player1-timer");
    if (player1Timer) {
        player1Timer.textContent = format(xMsec);
        player1Timer.className =
            "font-mono text-2xl text-red-600 bg-gray-100 px-2 py-1 rounded";
    }
    const player2Timer = document.getElementById("player2-timer");
    if (player2Timer) {
        player2Timer.textContent = format(oMsec);
        player2Timer.className =
            "font-mono text-2xl text-green-600 bg-gray-100 px-2 py-1 rounded";
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
    <p class="text-sm text-gray-500 mb-1">LEVEL</p>
    <p class="text-6xl font-extrabold text-gray-800">${(_a = board.boardId.split("-").pop()) !== null && _a !== void 0 ? _a : 1}</p>
  `;
    const rightDiv = document.createElement("div");
    rightDiv.className = "flex flex-col gap-y-1";
    rightDiv.innerHTML = `
    <div class="text-center border-2 border-solid border-blue-600 px-3 py-1 rounded">
      <div class="flex items-center justify-between gap-x-2 w-full pl-2">
        <p class="text-left text-base sm:text-lg md:text-xl font-semibold text-blue-600 whitespace-nowrap overflow-hidden text-ellipsis flex-grow min-w-0" title="${player.name}">${player.name}</p>
        <p class="text-lg text-gray-700 flex-shrink-0"><span id="player1-timer"></span></p>
      </div>
    </div>
    <div class="text-center border-2 border-solid border-green-600 px-3 py-1 rounded">
      <div class="flex items-center justify-center gap-x-2 w-full pl-2">
        <p class="text-left text-base sm:text-lg md:text-xl font-semibold text-green-600 whitespace-nowrap overflow-hidden text-ellipsis flex-grow min-w-0" title="${(opponent && opponent.name) || "AI"}">${(opponent && opponent.name) || "AI"}</p>
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
function getCurrentBoard() {
    // Return the board whose turn it is, or fallback to the first board
    if (player && player.boards.length > 0)
        return player.boards[0];
    if (opponent && opponent.boards.length > 0)
        return opponent.boards[0];
    return game.boards[0];
}
function startTimerInterval() {
    if (timerIntervalId !== undefined)
        clearInterval(timerIntervalId);
    timerIntervalId = window.setInterval(() => {
        const currentBoard = getCurrentBoard();
        if (currentBoard) {
            updateBothTimers(currentBoard, document);
            // Check for timeout winner if any timer reaches 0
            currentBoard.checkConditionWinner();
            // Optionally, stop timer if board is finished
            if (currentBoard.boardWinner) {
                clearInterval(timerIntervalId);
                timerIntervalId = undefined;
            }
        }
    }, 100);
}
function renderBoard(board, player, container) {
    container.innerHTML = "";
    const cardDiv = document.createElement("div");
    cardDiv.className =
        "bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] aspect-[3/4] mx-auto flex flex-col items-stretch";
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
game = createGame("You", 1, 5);
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
        var _a;
        game.startGame();
        player.updateBoards(game.boards);
        if (opponent) {
            opponent.updateBoards(game.boards);
        }
        // let displayBoard = game.boards[0];
        while (game.status === "started") {
            if (player.boards.length > 0) {
                const currentBoard = player.boards[0];
                const remainTimeMs = player.symbol === "X"
                    ? currentBoard.creatorRemainTime
                    : currentBoard.opponentRemainTime;
                const result = yield waitForPlayerMove(currentBoard, player, boardsContainer, remainTimeMs);
                if (result === "timeout") {
                    yield new Promise((res) => setTimeout(res, 100));
                    alert("Time's up! Turn skipped or handle timeout logic here.");
                    break;
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
        if (timerIntervalId !== undefined) {
            clearInterval(timerIntervalId);
            timerIntervalId = undefined;
        }
        clearInterval(timerIntervalId);
        yield new Promise((res) => setTimeout(res, 100));
        // Get the last board played (currentBoard or opponentBoard)
        const finalBoard = getCurrentBoard();
        const winner = (_a = finalBoard === null || finalBoard === void 0 ? void 0 : finalBoard.boardWinner) !== null && _a !== void 0 ? _a : "unknown";
        alert(`Game over! Winner is '${winner}'`);
    });
}
// Call this to start the loop
startGameLoop(boardsContainer);
startTimerInterval();
