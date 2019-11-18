import * as config from '../src/js/config';
import Gameboard from '../src/js/gameboard';
import Player from '../src/js/player';

it.only('should play a valid move', () => {
  const gameboard = new Gameboard(config.BOARD_SIZE);
  const player = new Player(gameboard);
  for (let row = 0; row < config.BOARD_SIZE; row += 1) {
    for (let col = 0; col < config.BOARD_SIZE; col += 1) {
      const { x, y } = player.getMove(() => 0);
      expect(x).toBe(col);
      expect(y).toBe(row);
      expect(gameboard.isValidMove(x, y)).toBe(true);
      gameboard.receiveAttack(col, row);
    }
  }
});
