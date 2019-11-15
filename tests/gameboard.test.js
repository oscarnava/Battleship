import * as globals from '../src/js/globals';
import Gameboard from '../src/js/gameboard';

it('should place a ship at specific coordinate', () => {
  const gameboard = new Gameboard(globals.BOARD_SIZE);
  const shipOptions = { length: globals.SHIP_SIZES[0], pos: [0, 0] };
  const expectedBoard = Array(globals.BOARD_SIZE * globals.BOARD_SIZE).fill('');
  expectedBoard[0] = 5;
  expectedBoard[1] = 5;
  expectedBoard[2] = 5;
  expectedBoard[3] = 5;
  expectedBoard[4] = 5;
  gameboard.placeShip(shipOptions);
  expect(gameboard.board).toEqual(expectedBoard);
  expect(gameboard.board[10]).toBe('');
});

it('should validate if a place is available for a ship', () => {
  const gameboard = new Gameboard(globals.BOARD_SIZE);
  const shipOptions = { length: globals.SHIP_SIZES[0], pos: [0, 0] };
  expect(gameboard.canPlaceShip(shipOptions)).toBe(true);
  gameboard.placeShip(shipOptions);
  expect(gameboard.canPlaceShip(shipOptions)).toBe(false);

  expect(gameboard.canPlaceShip({ length: 5, pos: [9, 9], vertical: true })).toBe(false);
  expect(gameboard.canPlaceShip({ length: 5, pos: [9, 0] })).toBe(false);
});
