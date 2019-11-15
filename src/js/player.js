export default class Player {
  constructor(gameboard) {
    this.gameboard = gameboard;
  }

  getMove() {
    if (this.gameboard.validMoves.length === 0) {
      return false;
    }
    const randPos = Math.floor(Math.random() * this.gameboard.validMoves.length);
    const position = this.gameboard.validMoves[randPos];
    const y = Math.floor(position / this.gameboard.boardSize);
    const x = position % this.gameboard.boardSize;
    return { x, y };
  }
}