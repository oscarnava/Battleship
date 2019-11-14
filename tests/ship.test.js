import Ship from '../src/js/ship';

it('should have a length and a position', () => {
  const ship = new Ship({ length: 2, pos: [0, 0] });

  expect(ship.length).toBe(2);
  expect(ship.x).toBe(0);
  expect(ship.y).toBe(0);
});

it('should know when has been gotHit', () => {
  const horzShip = new Ship({ length: 2, pos: [0, 0] });

  expect(horzShip.gotHit(0, 0)).toBe(true);
  expect(horzShip.gotHit(1, 0)).toBe(true);
  expect(horzShip.gotHit(2, 0)).toBe(false);

  const vertShip = new Ship({ length: 5, pos: [3, 4], vertical: true });
  expect(vertShip.gotHit(3, 3)).toBe(false);
  expect(vertShip.gotHit(3, 4)).toBe(true);
  expect(vertShip.gotHit(3, 5)).toBe(true);
  expect(vertShip.gotHit(3, 6)).toBe(true);
  expect(vertShip.gotHit(3, 7)).toBe(true);
  expect(vertShip.gotHit(3, 8)).toBe(true);
  expect(vertShip.gotHit(3, 9)).toBe(false);
});

it('should ignore repeated hits on the same place', () => {
  const horzShip = new Ship({ length: 2, pos: [0, 0] });

  horzShip.bombAt(0, 0);
  expect(horzShip.hits.length).toBe(1);

  horzShip.bombAt(0, 0);
  expect(horzShip.hits.length).toBe(1);

  horzShip.bombAt(0, 0);
  expect(horzShip.hits.length).toBe(1);

  horzShip.bombAt(1, 0);
  expect(horzShip.hits.length).toBe(2);
});

it('should know when it was sunk', () => {
  const horzShip = new Ship({ length: 2, pos: [0, 0] });
  expect(horzShip.isSunk()).toBe(false);

  horzShip.bombAt(0, 0);
  expect(horzShip.isSunk()).toBe(false);

  horzShip.bombAt(0, 0);
  expect(horzShip.isSunk()).toBe(false);

  horzShip.bombAt(0, 0);
  expect(horzShip.isSunk()).toBe(false);

  horzShip.bombAt(1, 0);
  expect(horzShip.isSunk()).toBe(true);

  const vertShip = new Ship({ length: 5, pos: [3, 4], vertical: true });
  expect(vertShip.isSunk()).toBe(false);

  vertShip.bombAt(3, 4);
  expect(vertShip.isSunk()).toBe(false);

  vertShip.bombAt(3, 4);
  expect(vertShip.isSunk()).toBe(false);

  vertShip.bombAt(3, 4);
  expect(vertShip.isSunk()).toBe(false);

  vertShip.bombAt(3, 5);
  expect(vertShip.isSunk()).toBe(false);

  vertShip.bombAt(3, 6);
  expect(vertShip.isSunk()).toBe(false);

  vertShip.bombAt(3, 7);
  expect(vertShip.isSunk()).toBe(false);

  vertShip.bombAt(3, 8);
  expect(vertShip.isSunk()).toBe(true);
});
