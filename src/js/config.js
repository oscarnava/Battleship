const urlParams = new URLSearchParams(window.location.search);
const size = +urlParams.get('boardsize');

const BOARD_SIZE = size >= 6 && size <= 16 ? size : 10; // 6 ~ 16
const CELL_SIZE = Math.floor(400 / BOARD_SIZE);
const MARGIN = 3;
const OCEAN_COLOR = '#065471';
const GRID_COLOR = '#4b8e8d';

const SHIP_SIZES = [5, 5, 5, 5, 4, 3, 3, 2, 2, 2].slice(8 - Math.floor(BOARD_SIZE / 2));

export {
  BOARD_SIZE,
  CELL_SIZE,
  SHIP_SIZES,
  MARGIN,

  OCEAN_COLOR,
  GRID_COLOR,
};
