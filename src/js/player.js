export default class Player {
  constructor(gameboard) {
    this.gameboard = gameboard;
  }

  // eslint-disable-next-line class-methods-use-this
  strategy() {
    return (moves) => moves[Math.floor(Math.random() * moves.length)];
  }

  getMove() {
    return this.gameboard.getStrategicMove(this.strategy());
  }
}
