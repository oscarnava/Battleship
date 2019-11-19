import * as config from '../src/js/config';
import Gameboard from '../src/js/gameboard';
import Player from '../src/js/player';

it('should play a valid move', () => {
  const gameboard = new Gameboard(config.BOARD_SIZE);
  const player = new Player(gameboard);
  player.strategy = moves => moves[0];

  for (let row = 0; row < config.BOARD_SIZE; row += 1) {
    for (let col = 0; col < config.BOARD_SIZE; col += 1) {
      const { x, y } = player.getMove();
      expect(x).toBe(col);
      expect(y).toBe(row);
      expect(gameboard.isValidMove(x, y)).toBe(true);
      gameboard.receiveAttack(col, row);
    }
  }
});
