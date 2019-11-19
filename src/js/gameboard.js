import { BOARD_SIZE } from './config';
import Ship from './ship';

const WATER = '.';
const HIT = 'H';
const MISS = 'X';

export default class Gameboard {
  constructor(boardSize = BOARD_SIZE) {
    this.boardSize = boardSize;
    this.ships = [];
    this.board = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(WATER));
    this.validMoves = Array.from({ length: this.boardSize * this.boardSize }, (v, i) => i);
  }

  getCell(x, y) {
    return this.board[x][y];
  }

  forEachShip(fn) {
    this.ships.forEach(fn);
  }

  getStrategicMove(strategyFn) {
    const validMoves = this.validMoves
      .map((position) => (
        { x: position % this.boardSize, y: Math.floor(position / this.boardSize) }
      ));
    return strategyFn(validMoves);
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

  removeShip(ship) {
    ship.getCoordinates().forEach(([x, y]) => {
      this.board[x][y] = WATER;
    });
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

  isShip(x, y) {
    return !!this.board[x][y].isShip;
  }

  isValidMove(x, y) {
    return this.isWater(x, y) || this.isShip(x, y);
  }

  receiveAttack(x, y) {
    const cell = this.board[x][y];
    if (cell.isShip) {
      cell.setDamage(x, y);
      this.board[x][y] = HIT;
    } else {
      this.board[x][y] = MISS;
    }
    this.validMoves = this.validMoves.filter((pos) => pos !== y * this.boardSize + x);
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
