import { BOARD_SIZE } from './config';
import Ship from './ship';

const WATER = '.';
const HIT = '*';
const MISS = 'x';
const SUNK = '$';

export default class Gameboard {
  constructor(boardSize = BOARD_SIZE) {
    this.boardSize = boardSize;
    this.ships = [];
    this.board = Array.from({ length: this.boardSize }, () => Array(this.boardSize).fill(WATER));
    this.validMoves = Array.from({ length: this.boardSize * this.boardSize }, (v, i) => i);
    this.probs = null;
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
    const ship = options.isShip ? options.reset() : new Ship(options);
    if (ship.x < 0 || ship.y < 0) return false;

    return !ship
      .coordinates
      .find(([x, y]) => x >= this.boardSize || y >= this.boardSize || this.board[x][y] !== WATER);
  }

  placeShip(options) {
    const ship = options.isShip ? options.reset() : new Ship(options);
    this.ships.push(ship);
    ship.coordinates.forEach(([x, y]) => {
      this.board[x][y] = ship;
    });
    return ship;
  }

  removeShip(ship) {
    ship.coordinates.forEach(([x, y]) => {
      this.board[x][y] = WATER;
    });
    this.ships = this.ships.filter((sh) => sh !== ship);
  }

  isWater(x, y) {
    return this.board[x][y] === WATER;
  }

  isSunk(x, y) {
    return this.board[x][y] === SUNK;
  }

  isHitOnly(x, y) {
    return this.board[x][y] === HIT;
  }

  isHit(x, y) {
    return this.isHitOnly(x, y) || this.isSunk(x, y);
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
    const ship = this.board[x][y];
    if (ship.isShip) {
      ship.setDamage(x, y);
      if (ship.isSunk) {
        ship.coordinates.forEach(([col, row]) => { this.board[col][row] = SUNK; });
      } else {
        this.board[x][y] = HIT;
      }
    } else {
      this.board[x][y] = MISS;
    }
    this.validMoves = this.validMoves.filter((pos) => pos !== y * this.boardSize + x);
  }

  allSunk() {
    return !this.ships.find((ship) => !ship.isSunk);
  }

  shipsLeft() {
    return this.ships.filter((ship) => !ship.isSunk).map((ship) => ship.length);
  }

  shuffleShips() {
    this.ships.forEach((ship) => {
      this.removeShip(ship);
      ship.placeRandom(this);
      while (!this.canPlaceShip(ship)) {
        ship.placeRandom(this);
      }
      this.placeShip(ship);
    });
  }

  forEachMove(callback) {
    for (let x = 0; x < this.boardSize; x += 1) {
      for (let y = 0; y < this.boardSize; y += 1) {
        if (this.isHit(x, y)) callback(x, y, true);
        if (this.isMiss(x, y)) callback(x, y, false);
      }
    }
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
