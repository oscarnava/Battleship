/* eslint-disable no-new */
import * as config from './config';

const CLIPART_PATH = './clipart';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let boatImages;

const loadBoats = async () => {
  const imgs = ['splash', 'explosion', 'ship-2', 'ship-3', 'ship-4', 'ship-5'];
  return Promise.all(
    imgs.map(img => new Promise((resolve, reject) => {
      const imgElement = new Image();
      imgElement.src = `${CLIPART_PATH}/${img}.svg`;
      imgElement.onload = () => resolve(imgElement);
      imgElement.onerror = () => reject(new Error('Could not load img'));
    })),
  );
};

const getShipImage = size => boatImages[size];

const drawIcon = (icon, left, top, x, y) => {
  ctx.drawImage(
    icon,
    left + x * config.CELL_SIZE + config.MARGIN,
    top + y * config.CELL_SIZE + config.MARGIN,
    config.CELL_SIZE - 2 * config.MARGIN,
    config.CELL_SIZE - 2 * config.MARGIN,
  );
};

export default class GraphicBoard {
  constructor(board, left, top, blind = false) {
    this.board = board;
    this.left = left;
    this.top = top;
    this.blind = blind;
    this.size = board.boardSize * config.CELL_SIZE;
    this.size = board.boardSize * config.CELL_SIZE;
    this.editMode = false;

    this.onMouseMove((x, y) => {
      if (this.editMode || this.board.isValidMove(x, y)) {
        canvas.style.cursor = 'crosshair';
      } else {
        canvas.style.cursor = 'not-allowed';
      }
    });

    canvas.addEventListener('mouseleave', () => { canvas.style.cursor = 'default'; });
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

  drawShip(ship, alpha = 1.0, x = ship.x, y = ship.y) {
    const { length, vertical } = ship;
    const imgShip = getShipImage(length);
    const left = this.left + x * config.CELL_SIZE;
    const top = this.top + y * config.CELL_SIZE;
    const width = length * config.CELL_SIZE - 2 * config.MARGIN;
    const height = config.CELL_SIZE - 2 * config.MARGIN;

    ctx.save();
    ctx.globalAlpha = alpha;

    if (this.editMode) {
      ctx.rect(this.left, this.top, this.size, this.size);
      ctx.stroke();
      ctx.clip();
    }

    if (vertical) {
      ctx.translate(left + config.CELL_SIZE, top);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(imgShip, config.MARGIN, config.MARGIN, width, height);
    } else {
      ctx.drawImage(imgShip, left + config.MARGIN, top + config.MARGIN, width, height);
    }
    ctx.restore();
  }

  drawShips() {
    this.board.forEachShip((ship) => {
      if (this.blind && !ship.isSunk()) {
        this.drawShip(ship, 0.0);
      } else {
        this.drawShip(ship);
      }
    });
  }

  drawMoves() {
    this.board.forEachMove((x, y, isHit) => {
      if (isHit) this.drawHit(x, y); else this.drawMiss(x, y);
    });
  }

  drawGameOver() {
    const msg = 'Game over';

    ctx.fillStyle = 'red';
    ctx.font = `bold ${config.CELL_SIZE * 1.5}px sans-serif`;

    const { width, actualBoundingBoxAscent: heigth } = ctx.measureText(msg);
    ctx.fillText('Game over', this.left + (this.size - width) / 2, this.top + (this.size + heigth) / 2);
  }

  async draw() {
    this.drawBoard();
    if (!boatImages) boatImages = await loadBoats();
    this.drawShips();
    this.drawMoves();
    if (this.board.allSunk()) {
      this.drawGameOver();
    }
  }

  drawMiss(x, y) {
    drawIcon(boatImages[0], this.left, this.top, x, y);
  }

  drawHit(x, y) {
    drawIcon(boatImages[1], this.left, this.top, x, y);
  }

  mouseEvent(event, callback) {
    const { clientX = -1, clientY = -1 } = event;
    const { left, top } = canvas.getBoundingClientRect();
    const x = Math.floor((clientX - this.left - left) / config.CELL_SIZE);
    const y = Math.floor((clientY - this.top - top) / config.CELL_SIZE);
    if (x >= 0 && y >= 0 && x < this.board.boardSize && y < this.board.boardSize) {
      callback(x, y, this.board.getCell(x, y), this);
      event.preventDefault();
    }
  }

  onClick(callback) {
    canvas.addEventListener('click', (event) => {
      if (this.editMode || this.board.allSunk()) return;

      this.mouseEvent(event, callback);
    });
  }

  onMouseMove(callback) {
    canvas.addEventListener('mousemove', event => this.mouseEvent(event, callback));
  }

  onMouseDown(callback) {
    canvas.addEventListener('mousedown', event => this.mouseEvent(event, callback));
  }

  onMouseUp(callback) {
    canvas.addEventListener('mouseup', event => this.mouseEvent(event, callback));
  }

  onDblClick(callback) {
    canvas.addEventListener('dblclick', event => this.mouseEvent(event, callback));
  }
}
