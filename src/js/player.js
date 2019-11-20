export default class Player {
  constructor(gameboard) {
    this.gameboard = gameboard;
  }

  // eslint-disable-next-line class-methods-use-this
  strategy(moves) {
    const hit = (x, y) => (x >= 0)
        && (y >= 0)
        && (x < this.gameboard.boardSize)
        && (y < this.gameboard.boardSize)
        && this.gameboard.isHit(x, y);

    const target = moves.find(
      ({ x, y }) => hit(x - 1, y) || hit(x + 1, y) || hit(x, y - 1) || hit(x, y + 1),
    );
    if (target) return target;

    return moves[Math.floor(Math.random() * moves.length)];
  }

  getMove() {
    return this.gameboard.getStrategicMove(this.strategy.bind(this));
  }
}
