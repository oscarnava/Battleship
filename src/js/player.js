import Ship from './ship';

const logProbs = (probs) => {
  const fmt = (n) => '0'.repeat(n < 16 ? 1 : 0) + n.toString(16);

  console.clear();
  for (let y = 0; y < probs.length; y += 1) {
    console.log(probs[y].map(fmt).join('.'));
  }
};

const evaluate = (ship, board, probs) => {
  const coord = ship.coordinates;
  // console.log(cord);

  if (coord.find(
    ([x, y]) => board.isMiss(x, y) || board.isSunk(x, y),
  )) return;

  const weight = coord.reduce(
    (wgt, [x, y]) => wgt * (board.isHitOnly(x, y) ? 5 : 1),
    1,
  );

  coord.forEach(([x, y]) => { if (!board.isHitOnly(x, y)) probs[y][x] += weight; });
};

export default class Player {
  constructor(gameboard) {
    this.gameboard = gameboard;
  }

  testShipSize(shipLen, probs) {
    const board = this.gameboard;
    const size = board.boardSize;
    const ship = new Ship({ length: shipLen, pos: [0, 0] });

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size - shipLen + 1; x += 1) {
        evaluate(ship.moveTo(x, y), board, probs);
      }
    }

    ship.turn(); // Vertical

    for (let x = 0; x < size; x += 1) {
      for (let y = 0; y < size - shipLen + 1; y += 1) {
        evaluate(ship.moveTo(x, y), board, probs);
      }
    }

    return probs;
  }

  // eslint-disable-next-line class-methods-use-this
  strategy(moves) {
    const size = this.gameboard.boardSize;
    const probs = Array.from({ length: size }, () => Array(size).fill(0));
    const shipsLeft = this.gameboard.shipsLeft();

    shipsLeft.forEach((shipSize) => {
      this.testShipSize(shipSize, probs);
    });

    // logProbs(probs);

    for (let i = 0; i < moves.length - 1; i += 1) {
      const j = Math.floor(Math.random() * moves.length);
      if (i !== j) {
        const tmp = moves[i];
        moves[i] = moves[j];
        moves[j] = tmp;
      }
    }

    return moves.reduce((a, b) => (probs[a.y][a.x] > probs[b.y][b.x] ? a : b));
  }

  getMove() {
    return this.gameboard.getStrategicMove(this.strategy.bind(this));
  }
}
