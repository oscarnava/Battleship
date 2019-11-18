export default class Player {
  constructor(gameboard) {
    this.gameboard = gameboard;
  }

  getMove(randFn = Math.random) {
    return this.gameboard.randomValidMove(randFn);
  }
}
