import Ship from './ship';

const WATER = '.';
const HIT = 'H';
const MISS = 'X';

export default class Gameboard {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.ships = [];
    this.board = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(WATER));
  }

  getCell(x, y) {
    return this.board[x][y];
  }

  canPlaceShip(options) {
    const ship = new Ship(options);
    if (ship.x < 0 || ship.y < 0) return false;

    return !ship
      .getCoordinates()
      .find(([x, y]) => x >= this.boardSize || y >= this.boardSize || this.board[x][y] !== WATER);
  }

  placeShip(options) {
    const ship = new Ship(options);
    this.ships.push(ship);
    ship.getCoordinates().forEach(([x, y]) => {
      this.board[x][y] = ship;
    });
    return ship;
  }

  isWater(x, y) {
    return this.board[x][y] === WATER;
  }

  isHit(x, y) {
    return this.board[x][y] === HIT;
  }

  isMiss(x, y) {
    return this.board[x][y] === MISS;
  }

  receiveAttack(x, y) {
    const cell = this.board[x][y];
    if (cell.isShip) {
      cell.setDamage(x, y);
      this.board[x][y] = HIT;
    } else {
      this.board[x][y] = MISS;
    }
  }

  allSunk() {
    return !this.ships.find((ship) => !ship.isSunk());
  }

  toString() {
    let str = '';
    for (let y = 0; y < this.boardSize; y += 1) {
      for (let x = 0; x < this.boardSize; x += 1) {
        str += this.board[x][y].isShip ? 'S' : this.board[x][y];
      }
      str += '\n';
    }
    return str;
  }
}
