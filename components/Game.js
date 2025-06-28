var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Board } from "./Board.js";
export class Game {
    constructor(creator, boardNumber = 1, playerTimerPerBoard = 2 * 60) {
        this.boardNumber = 1; // Default to 1 board
        this.id = crypto.randomUUID();
        this.creator = creator;
        this.boardNumber = boardNumber;
        this.playerTimerPerBoard = playerTimerPerBoard;
        this.status = "waiting";
        this.boards = [];
        for (let i = 0; i < boardNumber; i++) {
            this.boards.push(new Board(this.id, i, playerTimerPerBoard));
        }
        // Do not call initBoards here
    }
    addOpponent(opponent) {
        this.opponent = opponent;
        this.initBoards();
    }
    initBoards() {
        if (!this.creator || !this.opponent) {
            throw new Error("Both creator and opponent must be set before initializing boards.");
        }
        this.boards = [];
        for (let i = 0; i < this.boardNumber; i++) {
            const board = new Board(this.id, i, this.playerTimerPerBoard);
            board.setCreator(this.creator);
            board.setOpponet(this.opponent);
            const startingPlayer = i % 2 === 0 ? this.creator : this.opponent;
            board.setCurrentTurn(startingPlayer);
            this.boards.push(board);
        }
    }
    startGame() {
        // console.log("Game started with boards:", this.boards);
        this.status = "started";
        this.gameStartDateTime = new Date();
        this.boards.forEach((board) => {
            board.setBoardStartTime(this.gameStartDateTime);
        });
    }
    setWinner(winner) {
        this.winner = winner;
        this.status = "completed";
    }
    reset() {
        this.initBoards();
        this.status = "waiting";
        this.winner = undefined;
        this.gameStartDateTime = undefined;
    }
    getWinner() {
        if (!this.boards.every((board) => board.boardWinner)) {
            return { status: this.status, winner: undefined };
        }
        let xWins = 0;
        let oWins = 0;
        for (const board of this.boards) {
            if (board.boardWinner === "X")
                xWins++;
            if (board.boardWinner === "O")
                oWins++;
        }
        if (xWins > oWins) {
            this.winner = this.creator;
            this.status = "completed";
            return { status: this.status, winner: this.creator };
        }
        else if (oWins > xWins) {
            this.winner = this.opponent;
            this.status = "completed";
            return { status: this.status, winner: this.opponent };
        }
        else {
            this.winner = undefined;
            this.status = "tie";
            return { status: this.status, winner: undefined };
        }
    }
    playWithUI(boardsContainer, renderBoard, waitForPlayerMove) {
        return __awaiter(this, void 0, void 0, function* () {
            this.startGame();
            this.creator.updateBoards(this.boards);
            if (this.opponent)
                this.opponent.updateBoards(this.boards);
            while (this.status === "started") {
                if (this.creator.boards.length > 0) {
                    const currentBoard = this.creator.boards[0];
                    const remainTimeMs = this.creator.symbol === "X"
                        ? currentBoard.creatorRemainTime
                        : currentBoard.opponentRemainTime;
                    const result = yield waitForPlayerMove(currentBoard, this.creator, boardsContainer, remainTimeMs);
                    if (result === "timeout") {
                        alert("Time's up! Turn skipped or handle timeout logic here.");
                    }
                    this.getWinner();
                    this.creator.updateBoards(this.boards);
                    if (this.opponent)
                        this.opponent.updateBoards(this.boards);
                }
                else if (this.opponent instanceof AI && this.opponent.boards.length > 0) {
                    const opponentBoard = this.opponent.boards[0];
                    renderBoard(opponentBoard, this.opponent, boardsContainer);
                    yield this.opponent.makeMove(opponentBoard);
                    this.getWinner();
                    this.opponent.updateBoards(this.boards);
                    this.creator.updateBoards(this.boards);
                }
                else {
                    yield new Promise((res) => setTimeout(res, 100));
                }
                if (this.status !== "started")
                    break;
            }
            alert("Game over!");
        });
    }
}
