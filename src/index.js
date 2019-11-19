import * as config from './js/config';

import Gameboard from './js/gameboard';
import GraphicBoard from './js/graphicboard';

const humanGame = new Gameboard();

config.SHIP_SIZES
  .forEach((size, idx) => humanGame.placeShip({ length: size, pos: [idx, 0], vertical: true }));

const humanDisplay = new GraphicBoard(humanGame, 20, 20);

const setupGame = () => {
  humanDisplay.draw();
};

const run = () => {
  setupGame();
};

run();
