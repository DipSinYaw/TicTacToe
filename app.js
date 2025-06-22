// Create the board container
import { TicTacToeBoard } from "./components/TicTacToeBoard.js";
function drawBoard(cells) {
    var _a;
    // Remove any existing board
    const existingBoard = document.getElementById("tic-tac-toe-board");
    if (existingBoard) {
        existingBoard.remove();
    }
    // Create the board container
    const board = document.createElement("div");
    board.id = "tic-tac-toe-board";
    board.className = `
        grid grid-cols-3 gap-2
        w-full aspect-square
        max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
        mx-auto mt-10
    `.replace(/\s+/g, " ");
    // Create 9 cells
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
        cell.textContent = (_a = cells[i]) !== null && _a !== void 0 ? _a : "";
        board.appendChild(cell);
    }
    // Add the board to the body
    document.body.appendChild(board);
}
// Example usage:
const board = new TicTacToeBoard(["X", "", "O", "", "X", "O", "O", "", "X"]);
drawBoard(board.cells);
