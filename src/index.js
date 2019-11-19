import * as config from './js/config';

import Gameboard from './js/gameboard';
import GraphicBoard from './js/graphicboard';
import Player from './js/player';

let computer;
let humanGame;
let computerGame;
let humanDisplay;
let computerDisplay;
const gameOver = false;

const playMove = (x, y, graphBoard) => {
  const game = graphBoard.board;
  game.receiveAttack(x, y);
  if (game.isHit(x, y)) {
    graphBoard.draw();
  } else {
    graphBoard.drawMiss(x, y);
  }
};

const executeMove = (x, y, cell, graphBoard) => {
  if (gameOver) return;

  if (graphBoard.board.isValidMove(x, y)) {
    playMove(x, y, graphBoard);
    const { x: cx, y: cy } = computer.getMove();
    playMove(cx, cy, humanDisplay);
  }
};

const setupGame = () => {
  humanGame = new Gameboard();
  computerGame = new Gameboard();
  humanDisplay = new GraphicBoard(humanGame, 20, 20);
  computerDisplay = new GraphicBoard(
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

  computer = new Player(humanGame);

  humanGame.shuffleShips();
  computerGame.shuffleShips();

  humanDisplay.draw();
  computerDisplay.draw();

  computerDisplay.onClick(executeMove);
};

const run = () => {
  setupGame();
};

run();
