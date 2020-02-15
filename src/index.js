import * as config from './js/config';

import Gameboard from './js/gameboard';
import GraphicBoard from './js/graphicboard';
import Player from './js/player';
import playSound from './js/sound';

let computer;
let humanGame;
let computerGame;
let humanDisplay;
let computerDisplay;
let draggedShip;
let dragOpts;

const gameOver = () => humanGame.allSunk() || computerGame.allSunk();

const playMove = (x, y, graphBoard) => {
  const game = graphBoard.board;
  game.receiveAttack(x, y);
  graphBoard.draw();
  if (game.isHit(x, y)) {
    playSound('explosion');
    return true;
  }

  graphBoard.drawMiss(x, y);
  playSound('splash');
  return false;
};

let locked = false;
const computerMove = async () => {
  const { x: cx, y: cy } = computer.getMove();
  if (playMove(cx, cy, humanDisplay) && !gameOver()) {
    setTimeout(computerMove, 2000);
  } else {
    locked = false;
  }
};

const executeMove = async (x, y, cell, graphBoard) => {
  if (locked || gameOver()) return;

  humanDisplay.debugMode = document.querySelector('#debug').checked;

  if (graphBoard.board.isValidMove(x, y)) {
    locked = true;
    if (!playMove(x, y, graphBoard)) {
      await setTimeout(computerMove, 1000);
    } else {
      locked = false;
    }
    humanDisplay.editMode = false;
  }
};

const grabShip = (x, y, ship, graphBoard) => {
  if (!graphBoard.editMode) return;

  const game = graphBoard.board;
  if (ship.isShip) {
    draggedShip = ship;
    game.removeShip(ship);
    graphBoard.draw();
    dragOpts = { length: ship.length, pos: [x, y], vertical: ship.vertical };
    graphBoard.drawShip(draggedShip, 0.9, x, y);
  }
};

const moveShip = (x, y, cell, graphBoard) => {
  if (!draggedShip || (dragOpts.pos[0] === x && dragOpts.pos[1] === y)) return;

  const game = graphBoard.board;
  graphBoard.draw();

  dragOpts.pos = [x, y];

  if (game.canPlaceShip(dragOpts)) {
    graphBoard.drawShip(draggedShip, 0.9, x, y);
  } else {
    graphBoard.drawShip(draggedShip, 0.5, x, y);
  }
};

const dropShip = (x, y, cell, graphBoard) => {
  const game = graphBoard.board;

  dragOpts.pos = [x, y];

  if (draggedShip && game.canPlaceShip(dragOpts)) {
    game.canPlaceShip(dragOpts);
    draggedShip.moveTo(x, y);
  }
  game.placeShip(draggedShip);
  graphBoard.draw();
  draggedShip = null;
};

const turnShip = (x, y, ship, graphBoard) => {
  if (!graphBoard.editMode) return;

  const game = graphBoard.board;
  if (ship.isShip) {
    game.removeShip(ship);
    const opts = { length: ship.length, pos: [x, y], vertical: !ship.vertical };
    if (game.canPlaceShip(opts)) {
      ship.turn();
    }
    game.placeShip(ship);
    graphBoard.draw();
  }
};

const setupGame = () => {
  humanGame = new Gameboard();
  computerGame = new Gameboard();
  humanDisplay = new GraphicBoard(humanGame, 20, 20, 'Human');
  computerDisplay = new GraphicBoard(
    computerGame,
    humanDisplay.left + humanDisplay.size + 20,
    humanDisplay.top,
    'Computer',
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
  humanDisplay.onMouseDown(grabShip);
  humanDisplay.onMouseUp(dropShip);
  humanDisplay.onMouseMove(moveShip);
  humanDisplay.onDblClick(turnShip);

  humanDisplay.editMode = true;
};

setupGame();
