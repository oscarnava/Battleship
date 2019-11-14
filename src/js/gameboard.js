import Ship from './ship';
import * as globals from './globals';

export default class Gameboard {
  constructor() {
    this.board = Array(globals.BOARD_SIZE * globals.BOARD_SIZE).fill('');
  }

  canPlaceShip(options) {
    const ship = new Ship(options);
    return !ship.getCoordinates().find(([x, y]) => this.board[x + globals.BOARD_SIZE * y] !== '');
  }

  placeShip(options) {
    const ship = new Ship(options);
    ship.getCoordinates().forEach(([x, y]) => {
      this.board[x + globals.BOARD_SIZE * y] = ship.length;
    });
  }
}