export class Player {
    constructor(name, isCreator) {
        this.boards = [];
        this.name = name;
        this.isCreator = isCreator;
        this.symbol = isCreator ? "X" : "O";
    }
    updateBoards(allBoards) {
        // Filter boards where it's this player's turn
        const currentTime = Date.now();
        this.boards = allBoards
            .filter((board) => board.currentTurn === this)
            .sort((a, b) => {
            var _a, _b;
            // Sort by the player's remaining time (ascending)
            const aTime = this.symbol === "X" ? a.creatorRemainTime : a.opponentRemainTime;
            const aTurnTime = (_a = a.startTurnTime) !== null && _a !== void 0 ? _a : currentTime;
            const aRemainTime = aTime - (currentTime - aTurnTime);
            const bTime = this.symbol === "X" ? b.creatorRemainTime : b.opponentRemainTime;
            const bTurnTime = (_b = b.startTurnTime) !== null && _b !== void 0 ? _b : currentTime;
            const bRemainTime = bTime - (currentTime - bTurnTime);
            return aRemainTime - bRemainTime;
        });
        this.boards.forEach((board, index) => {
            if (this.isCreator) {
                console.log(`** boardId: ${board.boardId}, creatorRemainTime: ${board.creatorRemainTime}, opponentRemainTime: ${board.opponentRemainTime}`);
                console.log(`boardCell: ${board.cells.join(", ")}`);
                console.log(`boardWinner: ${board.boardWinner}`);
            }
        });
    }
    onClick(board, cellIndex) {
        if (board.currentTurn === this &&
            !board.cells[cellIndex] &&
            !board.boardWinner) {
            board.fillCell(cellIndex, this.symbol);
            // board.drawBoard(); // Update the board UI if needed
        }
    }
}
