/* eslint-disable no-new */
import * as config from './config';

const CLIPART_PATH = './clipart';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let boatImages;

const loadBoats = async () => {
  const imgs = ['splash', 'explosion', 'ship-2', 'ship-3', 'ship-4', 'ship-5'];
  return Promise.all(
    imgs.map((img) => new Promise((resolve, reject) => {
      const imgElement = new Image();
      imgElement.src = `${CLIPART_PATH}/${img}.svg`;
      imgElement.onload = () => resolve(imgElement);
      imgElement.onerror = () => reject(new Error('Could not load img'));
    })),
  );
};

const getShipImage = (size) => boatImages[size];

export default class GraphicBoard {
  constructor(board, left, top, blind = false) {
    this.board = board;
    this.left = left;
    this.top = top;
    this.size = board.boardSize * config.CELL_SIZE;
    this.blind = blind;
    this.size = board.boardSize * config.CELL_SIZE;
  }

  drawBoard() {
    ctx.fillStyle = config.OCEAN_COLOR;
    ctx.fillRect(this.left, this.top, this.size, this.size);

    ctx.strokeStyle = config.GRID_COLOR;
    for (let i = 0; i <= this.size; i += config.CELL_SIZE) {
      ctx.moveTo(this.left + i, this.top);
      ctx.lineTo(this.left + i, this.top + this.size);
      ctx.stroke();
      ctx.moveTo(this.left, this.top + i);
      ctx.lineTo(this.left + this.size, this.top + i);
      ctx.stroke();
    }
  }

  drawShips() {
    this.board.forEachShip((ship) => {
      const { length, x, y, vertical } = ship;
      const imgShip = getShipImage(length);
      const left = this.left + x * config.CELL_SIZE;
      const top = this.top + y * config.CELL_SIZE;
      const width = length * config.CELL_SIZE - 2 * config.MARGIN;
      const height = config.CELL_SIZE - 2 * config.MARGIN;
      if (vertical) {
        ctx.save();
        ctx.translate(left + config.CELL_SIZE, top);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(imgShip, config.MARGIN, config.MARGIN, width, height);
        ctx.restore();
      } else {
        ctx.drawImage(imgShip, left + config.MARGIN, top + config.MARGIN, width, height);
      }
    });
  }

  async draw() {
    this.drawBoard();
    if (!boatImages) boatImages = await loadBoats();
    this.drawShips();
  }
}
