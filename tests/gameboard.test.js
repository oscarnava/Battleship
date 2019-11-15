import * as config from '../src/js/config';
import Gameboard from '../src/js/gameboard';

it('should place a ship at specific coordinate', () => {
  const gameboard = new Gameboard(config.BOARD_SIZE);
  const shipOptions = { length: config.SHIP_SIZES[0], pos: [0, 0] };
  const expectedBoard = Array(config.BOARD_SIZE * config.BOARD_SIZE).fill('');
  const ship = gameboard.placeShip(shipOptions);
  expect(ship.isShip).toBe(true);

  expectedBoard[0] = ship;
  expectedBoard[1] = ship;
  expectedBoard[2] = ship;
  expectedBoard[3] = ship;
  expectedBoard[4] = ship;
  expect(gameboard.board).toEqual(expectedBoard);
  expect(gameboard.board[10]).toBe('');
});

it('should validate if a place is available for a ship', () => {
  const gameboard = new Gameboard(config.BOARD_SIZE);
  const shipOptions = { length: config.SHIP_SIZES[0], pos: [0, 0] };
  expect(gameboard.canPlaceShip(shipOptions)).toBe(true);
  gameboard.placeShip(shipOptions);
  expect(gameboard.canPlaceShip(shipOptions)).toBe(false);

  expect(gameboard.canPlaceShip({ length: 5, pos: [9, 9], vertical: true })).toBe(false);
  expect(gameboard.canPlaceShip({ length: 5, pos: [9, 0] })).toBe(false);
});

it('sould record an attack correcttly', () => {
  const gameboard = new Gameboard(config.BOARD_SIZE);
  const ship = gameboard.placeShip({ length: 2, pos: [0, 0] });

  gameboard.receiveAttack(0, 0);
  expect(ship.damage).toEqual(1);
});
