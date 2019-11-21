import * as config from './config';

export default class Ship {
  constructor({ length, pos: [x, y], vertical = false }) {
    this.length = length;
    this.x = x;
    this.y = y;
    this.vertical = vertical;
    this.hits = [];
    this.isShip = true;
    this._coord = null;
  }

  get coordinates() {
    if (!this._coord) {
      this._coord = [];
      for (let i = 0; i < this.length; i += 1) {
        this._coord.push(this.vertical ? [this.x, this.y + i] : [this.x + i, this.y]);
      }
    }
    return this._coord;
  }

  gotHit(x, y) {
    const ofs = this.vertical ? y - this.y : x - this.x;
    return (ofs >= 0) && (ofs < this.length);
  }

  setDamage(x, y) {
    if (this.gotHit(x, y)) {
      const cell = x + y * config.BOARD_SIZE;
      if (!this.hits.includes(cell)) this.hits.push(cell);
    }
  }

  get damage() {
    return this.hits.length;
  }

  isSunk() {
    return this.hits.length === this.length;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    this._coord = null;
  }

  turn() {
    this.vertical = !this.vertical;
    this._coord = null;
  }

  reset() {
    this._coord = null;
    return this;
  }

  placeRandom(board) {
    this.x = Math.floor(Math.random() * (board.boardSize - this.length + 1));
    this.y = Math.floor(Math.random() * (board.boardSize - this.length + 1));
    this.vertical = Math.random() >= 0.5;
    this._coord = null;
  }

  toString() {
    return `Ship[${this.length}] @ (${this.x}, ${this.y}); damage: ${this.damage}`;
  }
}
