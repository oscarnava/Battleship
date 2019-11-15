import Ship from './ship';

export default class Gameboard {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = Array(this.boardSize * this.boardSize).fill('');
  }

  canPlaceShip(options) {
    const ship = new Ship(options);
    if (ship.x < 0 || ship.y < 0) return false;

    return !ship.getCoordinates().find(([x, y]) => (x >= this.boardSize) || (y >= this.boardSize) || (this.board[x + this.boardSize * y] !== ''));
  }

  placeShip(options) {
    const ship = new Ship(options);
    ship.getCoordinates().forEach(([x, y]) => {
      this.board[x + this.boardSize * y] = ship;
    });
    return ship;
  }

  receiveAttack (x, y) {

  }
}
