import * as config from './config';

const CLIPART_PATH = './clipart';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const boatImages = [new Image(), new Image(), new Image(), new Image()];

const loadBoats = async () => {
  boatImages.forEach((img, index) => { img.src = `${CLIPART_PATH}/ship-${index + 2}.svg`; });
};

const getShipImage = (size) => boatImages[size - 2];

export default class GraphicBoard {
  constructor(board, left, top, blind = false) {
    this.board = board;
    this.left = left;
    this.top = top;
    this.blind = blind;
    this.size = board.boardSize * config.CELL_SIZE;
  }

  drawBoard() {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(this.left, this.top, this.size, this.size);

    ctx.strokeStyle = 'gray';
    for (let x = 0; x <= this.size; x += config.CELL_SIZE) {
      ctx.moveTo(this.left + x, this.top);
      ctx.lineTo(this.left + x, this.top + this.size);
      ctx.stroke();
    }

    for (let y = 0; y <= this.size; y += config.CELL_SIZE) {
      ctx.moveTo(this.left, this.top + y);
      ctx.lineTo(this.left + this.size, this.top + y);
      ctx.stroke();
    }
  }

  drawShips() {
    this.board.forEachShip((ship) => {
      const { length, x, y } = ship;
      ctx.drawImage(
        getShipImage(length),
        x * config.CELL_SIZE + config.MARGIN,
        y * config.CELL_SIZE + config.MARGIN,
        length * config.CELL_SIZE - 2 * config.MARGIN,
        config.CELL_SIZE - 2 * config.MARGIN,
      );
    });
  }

  async draw() {
    await loadBoats();
    this.drawBoard();
    this.drawShips();
  }
}
