import * as config from '../src/js/config';
import Gameboard from '../src/js/gameboard';

it('should place a ship at specific coordinate', () => {
  const gameboard = new Gameboard(config.BOARD_SIZE);
  const shipOptions = { length: config.SHIP_SIZES[0], pos: [0, 0] };
  const ship = gameboard.placeShip(shipOptions);
  expect(ship.isShip).toBe(true);

  expect(gameboard.getCell(0, 0)).toEqual(ship);
  expect(gameboard.getCell(1, 0)).toEqual(ship);
  expect(gameboard.getCell(2, 0)).toEqual(ship);
  expect(gameboard.getCell(3, 0)).toEqual(ship);
  expect(gameboard.getCell(4, 0)).toEqual(ship);
  expect(gameboard.getCell(0, 1)).not.toBe(ship);
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
  expect(gameboard.isHit(0, 0)).toBe(true);
  expect(gameboard.isSunk(1, 0)).toBe(false);

  gameboard.receiveAttack(0, 1);

  expect(ship.damage).toEqual(1);
  expect(gameboard.isMiss(0, 1)).toBe(true);

  gameboard.receiveAttack(1, 0);

  expect(ship.damage).toEqual(2);
  expect(gameboard.isHit(1, 0)).toBe(true);
  expect(gameboard.isSunk(1, 0)).toBe(true);
  expect(gameboard.isSunk(0, 0)).toBe(true);
});

it('Should detect when all ships have sunk', () => {
  const gameboard = new Gameboard(config.BOARD_SIZE);
  gameboard.placeShip({ length: 2, pos: [0, 0] });
  gameboard.placeShip({ length: 3, pos: [9, 7], vertical: true });

  gameboard.receiveAttack(0, 0);
  gameboard.receiveAttack(1, 0);
  expect(gameboard.allSunk()).toBe(false);

  gameboard.receiveAttack(9, 7);
  gameboard.receiveAttack(9, 9);
  expect(gameboard.allSunk()).toBe(false);

  gameboard.receiveAttack(9, 8);
  expect(gameboard.allSunk()).toBe(true);
});

it('Should validate a move', () => {
  const gameboard = new Gameboard(config.BOARD_SIZE);
  gameboard.placeShip({ length: 2, pos: [0, 0] });
  expect(gameboard.isValidMove(0, 0)).toBe(true);
  gameboard.receiveAttack(0, 0);
  expect(gameboard.isValidMove(0, 0)).toBe(false);
  expect(gameboard.isValidMove(3, 0)).toBe(true);
  gameboard.receiveAttack(3, 0);
  expect(gameboard.isValidMove(3, 0)).toBe(false);
});

it('Should return an array of valid moves', () => {
  const gameboard = new Gameboard(3);
  expect(gameboard.validMoves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  gameboard.placeShip({ length: 2, pos: [0, 0] });
  expect(gameboard.validMoves).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  gameboard.receiveAttack(0, 0);
  expect(gameboard.validMoves).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  gameboard.receiveAttack(2, 0);
  expect(gameboard.validMoves).toEqual([1, 3, 4, 5, 6, 7, 8]);
});
