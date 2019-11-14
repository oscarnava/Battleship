export default class Ship {
  constructor({ length, pos: [x, y], vertical = false }) {
    this.length = length;
    this.x = x;
    this.y = y;
    this.vertical = vertical;
    this.hits = [];
  }

  gotHit(x, y) {
    const ofs = this.vertical ? y - this.y : x - this.x;
    return (ofs >= 0) && (ofs < this.length);
  }

  bombAt(x, y) {
    if (this.gotHit(x, y)) {
      const cell = x + y * 10;
      if (!this.hits.includes(cell)) this.hits.push(cell);
    }
  }

  isSunk() {
    return this.hits.length === this.length;
  }
}
