import * as config from './js/config';

import Gameboard from './js/gameboard';
import GraphicBoard from './js/graphicboard';

const executeMove = (x, y, cell, board) => {
  const game = board.board;
  if (game.isValidMove(x, y)) {
    game.receiveAttack(x, y);
    if (game.isHit(x, y)) {
      board.draw();
    } else {
      board.drawMiss(x, y);
    }
  }
};

const setupGame = () => {
  const humanGame = new Gameboard();
  const computerGame = new Gameboard();
  const humanDisplay = new GraphicBoard(humanGame, 20, 20);
  const computerDisplay = new GraphicBoard(
    computerGame,
    humanDisplay.left,
    humanDisplay.top + humanDisplay.size + 20,
    true,
  );

  config.SHIP_SIZES
    .forEach((size, idx) => {
      humanGame.placeShip({ length: size, pos: [idx, 0], vertical: true });
      computerGame.placeShip({ length: size, pos: [idx, 0], vertical: true });
    });

  humanGame.shuffleShips();
  computerGame.shuffleShips();

  humanDisplay.draw();
  computerDisplay.draw();

  // humanDisplay.onClick(executeMove);
  computerDisplay.onClick(executeMove);
};

const run = () => {
  setupGame();
};

run();
