import * as config from './config';

export default class Ship {
  constructor({ length, pos: [x, y], vertical = false }) {
    this.length = length;
    this.x = x;
    this.y = y;
    this.vertical = vertical;
    this.hits = [];
    this.isShip = true;
  }

  getCoordinates() {
    const coordinates = [];
    for (let i = 0; i < this.length; i += 1) {
      coordinates.push(this.vertical ? [this.x, this.y + i] : [this.x + i, this.y]);
    }
    return coordinates;
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
}
