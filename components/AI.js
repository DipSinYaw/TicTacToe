import { Player } from "./Player.js";
export class AI extends Player {
    constructor(name, isCreator, difficulty = "easy") {
        super(name, isCreator);
        this._moveDelayMs = 100; // 5 seconds delay
        this.difficulty = difficulty;
    }
    // AI will only move if it's its turn, with delay
    makeMove(board) {
        console.log(`${this.name} is making a move...`);
        return new Promise((resolve) => {
            if (board.currentTurn !== this) {
                resolve(false); // Not AI's turn
                return;
            }
            setTimeout(() => {
                // Collect all empty cell indices
                const emptyIndices = board.cells
                    .map((cell, idx) => (cell ? -1 : idx))
                    .filter((idx) => idx !== -1);
                if (emptyIndices.length === 0) {
                    resolve(false); // No moves left
                }
                else {
                    // Pick a random empty index
                    const idx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                    resolve(board.fillCell(idx, this.symbol));
                }
            }, this._moveDelayMs);
        });
    }
}
