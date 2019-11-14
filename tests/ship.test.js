import Ship from '../src/js/ship';

it('should have a length and a position', () => {
  const ship = new Ship(2, 0, 0);

  expect(ship.length).toBe(2);
  expect(ship.x).toBe(0);
  expect(ship.y).toBe(0);
});

it('should know when has been hit');
it('should know when it was sunk');
