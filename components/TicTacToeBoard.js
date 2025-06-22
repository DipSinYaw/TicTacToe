export class TicTacToeBoard {
    constructor(cells, playerX = "X", playerO = "O") {
        this.cells = cells !== null && cells !== void 0 ? cells : Array(9).fill("");
        this.playerX = playerX;
        this.playerO = playerO;
    }
    reset() {
        this.cells = Array(9).fill("");
    }
}
