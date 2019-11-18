import Gameboard from './js/gameboard';
import GraphicBoard from './js/graphicboard';
// import Ship from './js/ship';

const player1 = new Gameboard();
player1.placeShip({ length: 5, pos: [0, 0] });
player1.placeShip({ length: 4, pos: [2, 2], vertical: true });

const humanBoard = new GraphicBoard(player1, 10, 20);

const setupGame = () => {
  setTimeout(
    () => {
      humanBoard.draw();
    }, 1000,
  );
};

const run = () => {
  setupGame();
};

run();
