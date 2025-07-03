export class Board {
    constructor(gameId, boardIndex, playerTimerPerBoard) {
        this.gameId = `${gameId}`;
        this.boardId = `${boardIndex + 1}`;
        this.cells = Array(9).fill("");
        this.playerTimerPerBoard = playerTimerPerBoard;
        this.moveTimes = new Map();
        this.creatorRemainTime = playerTimerPerBoard * 1000;
        this.opponentRemainTime = playerTimerPerBoard * 1000;
        this.boardDiv = document.createElement("div");
    }
    setCreator(creator) {
        var _a;
        if (creator.symbol !== "X") {
            throw new Error("Creator's symbol must be 'X'.");
        }
        (_a = this.creator) !== null && _a !== void 0 ? _a : (this.creator = creator);
    }
    setOpponet(opponent) {
        var _a;
        if (opponent.symbol !== "O") {
            throw new Error("Opponent's symbol must be 'O'.");
        }
        (_a = this.opponent) !== null && _a !== void 0 ? _a : (this.opponent = opponent);
    }
    setCurrentTurn(currentTurn) {
        var _a;
        (_a = this.currentTurn) !== null && _a !== void 0 ? _a : (this.currentTurn = currentTurn);
    }
    setBoardStartTime(time = new Date()) {
        this.boardStartTime = time;
        if (this.currentTurn) {
            this.startTurnTime = time.getTime();
            this.putMoveTimes(this.currentTurn.symbol);
        }
    }
    putMoveTimes(symbol) {
        if (!this.startTurnTime) {
            throw new Error("Start turn time is not set.");
        }
        this.moveTimes.set(this.startTurnTime, {
            symbol: symbol,
            remainTime: symbol === "X" ? this.creatorRemainTime : this.opponentRemainTime,
        });
    }
    fillCell(index, symbol) {
        this.checkConditionWinner();
        if (this.boardWinner) {
            return false; // Game already won
        }
        if (!this.currentTurn || this.currentTurn.symbol !== symbol) {
            return false;
        }
        if (index < 0 || index >= 9 || this.cells[index]) {
            return false;
        }
        this.cells[index] = symbol;
        this.checkThree();
        if (!this.boardWinner) {
            this.changeTurn();
        }
        // console.log(`this board winner: ${this.boardWinner}`);
        return true;
    }
    checkThree() {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // rows
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // cols
            [0, 4, 8],
            [2, 4, 6], // diagonals
        ];
        for (const [a, b, c] of lines) {
            if (this.cells[a] &&
                this.cells[a] === this.cells[b] &&
                this.cells[a] === this.cells[c]) {
                this.boardWinner = this.cells[a];
                return;
            }
        }
        if (this.checkBoardFull()) {
            this.boardWinner = "="; // Draw
        }
    }
    checkBoardFull() {
        return this.cells.every((cell) => cell !== undefined && cell !== "");
    }
    changeTurn() {
        if (!this.creator || !this.opponent) {
            throw new Error("Both players must be set before changing turns.");
        }
        if (!this.currentTurn) {
            throw new Error("Current turn is not set.");
        }
        this.updateCurrentTurnRemainTime(this.currentTurn.symbol);
        this.currentTurn =
            this.currentTurn === this.creator ? this.opponent : this.creator;
        this.startTurnTime = Date.now();
        this.putMoveTimes(this.currentTurn.symbol);
        // console.log(`Current turn changed to: ${this.currentTurn.symbol}`);
    }
    updateCurrentTurnRemainTime(symbol) {
        if (!this.startTurnTime) {
            throw new Error("Start turn time is not set.");
        }
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.startTurnTime;
        if (symbol === "X") {
            this.creatorRemainTime -= elapsedTime;
        }
        else {
            this.opponentRemainTime -= elapsedTime;
        }
        this.checkConditionWinner();
    }
    // Example: Check if the last move exceeded the allowed time
    checkConditionWinner() {
        if (this.boardWinner) {
            return this.boardWinner; // If already determined, return immediately
        }
        if (!this.currentTurn) {
            throw new Error("Current turn is not set.");
        }
        if (!this.startTurnTime) {
            throw new Error("Start turn time is not set.");
        }
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.startTurnTime;
        if (this.currentTurn.symbol === "X") {
            const opponentWinner = elapsedTime > this.creatorRemainTime;
            if (opponentWinner) {
                this.creatorRemainTime = 0; // Creator runs out of time
                this.boardWinner = "O"; // Opponent wins if creator runs out of time
            }
        }
        else {
            const creatorWinner = elapsedTime > this.opponentRemainTime;
            if (creatorWinner) {
                this.opponentRemainTime = 0; // Opponent runs out of time
                this.boardWinner = "X"; // Creator wins if opponent runs out of time
            }
        }
        return this.boardWinner;
    }
}
