import Component from '@ember/component';
import { computed } from '@ember/object';

/**
 * Map of goal color name to actual RGB value.
 * @type {{blue: string, red: string, yellow: string, green: string}}
 */
const colorMap = {
  blue: '#7EA7D2',
  red: '#F58C8F',
  yellow: '#FEF87D',
  green: '#C3E17E',
};

/**
 * The component that encompasses the entire board.
 */
const BoardCanvas = Component.extend({
  tagName: 'canvas',
  attributeBindings: ['id'],
  id: 'board',

  /**
   * The board to display.
   */
  board: null,

  /**
   * Holds the rendering context.
   */
  context: null,

  /**
   * Size of the walls.
   */
  wallSize: 4,

  /**
   * Color of the cell.
   */
  cellColor: '#f9f9f9',

  /**
   * Sizes.
   */
  cellSize: 50,
  boardWidth: computed('cellSize', 'board.nrRows', function() {
    return this.cellSize * this.board.nrRows;
  }),
  boardHeight: computed('cellSize', 'board.nrColumns', function() {
    return this.cellSize * this.board.nrColumns;
  }),

  /**
   * Color of the cell walls.
   */
  wallColor: '#7D7B7A',

  /**
   * Caches cell coordinates for easy lookup.
   */
  cellCoordinates: null,

  /**
   * Initialize the canvas and the board.
   */
  didInsertElement() {
    this.initialize();

    // Register the click handler for the canvas.
    const canvas = document.querySelector('canvas');

    canvas.addEventListener('click', (event) => {
      this.click(event.pageX, event.pageY);
    }, false);

    window.draw = () => {
      this.draw();
      window.requestAnimationFrame(window.draw);
    };
    window.draw();
  },

  /**
   * Initializes cell coordinates.
   */
  initialize() {
    const canvas = document.querySelector('canvas');
    const width = this.cellSize * this.board.cells.length;
    const height = this.cellSize * this.board.cells[0].length;

    // Is there a closure action for notifying about the board size?
    if (this.boardSizeCalculated) {
      this.boardSizeCalculated(width, height);
    }

    canvas.width = width;
    canvas.height = height;

    this.set('context', canvas.getContext('2d'));

    const { cells, nrRows, nrColumns } = this.board;
    const cellCoordinates = [];
    const xStart = parseInt((canvas.clientWidth - (nrColumns * this.cellSize)) / 2, 10);
    const yStart = parseInt((canvas.clientHeight - (nrRows * this.cellSize)) / 2, 10);

    // Cache cell coordinates.
    cells.forEach((row, rowIdx) => {
      cellCoordinates.push([]);
      row.forEach((column, columnIdx) => {
        const x = xStart + (columnIdx * this.cellSize);
        const y = yStart + (rowIdx * this.cellSize);

        cellCoordinates[rowIdx].push({
          x, y,
        });
      });
    });

    this.set('cellCoordinates', cellCoordinates);
  },

  /**
   * Draws the current board. The draw order is:
   * - Cells (and walls)
   * - Robot paths
   * - Robots
   */
  draw() {
    const { board } = this;
    const { cells } = board;
    const nrRows = cells.length;
    const nrColumns = nrRows;
    const { canvas } = this.context;
    let goalColor;
    let goalRowIdx;
    let goalColumnIdx;

    // For now simply clear the whole canvas and draw everything again.
    this.context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // If there is a current goal, get its target cell.
    if (board.currentGoal) {
      const { number } = board.currentGoal;

      goalColor = this.board.currentGoal.color;
      goalRowIdx = Math.floor(number / nrRows);
      goalColumnIdx = number % nrColumns;
    }

    // First draw the cells.
    cells.forEach((row, rowIdx) => {
      row.forEach((column, columnIdx) => {
        const coordinates = this.cellCoordinates[rowIdx][columnIdx];
        let color = this.cellColor;

        if (goalColor && rowIdx === goalRowIdx && columnIdx === goalColumnIdx) {
          color = colorMap[goalColor];
        }

        this.drawCell(cells[rowIdx][columnIdx], coordinates.x, coordinates.y, color);
      });
    });

    // Draw the goal, the robots and the paths.
    if (board.moves && board.moves.length > 0) {
      this.drawRobotStart(board.start);
      this.drawMoves(board.moves, board.start);
    }

    if (board.robots) {
      board.robots.forEach((robot) => {
        this.drawRobot(robot);
      });
    }
  },

  /**
   * Draws the given cell at the given coordinates.
   */
  drawCell(cell, x, y, color) {
    const {
      context, cellSize, wallColor, wallSize,
    } = this;
    const top = (cell & 1) > 0;
    const right = (cell & 2) > 0;
    const bottom = (cell & 4) > 0;
    const left = (cell & 8) > 0;

    // Cells with four walls are colored in.
    if (cell === 15) {
      context.fillStyle = 'gray';
      context.fillRect(x, y, cellSize, cellSize);
    } else {
      context.fillStyle = color;
      context.fillRect(x, y, cellSize, cellSize);

      // Background cell borders.
      context.strokeStyle = '#3B3E40';
      context.strokeRect(x, y, cellSize, cellSize);

      if (top) {
        context.fillStyle = wallColor;
        context.fillRect(x, y, cellSize, wallSize);
      }
      if (right) {
        context.fillStyle = wallColor;
        context.fillRect((x + cellSize) - wallSize, y, wallSize, cellSize);
      }
      if (bottom) {
        context.fillStyle = wallColor;
        context.fillRect(x, (y + cellSize) - wallSize, cellSize, wallSize);
      }
      if (left) {
        context.fillStyle = wallColor;
        context.fillRect(x, y, wallSize, cellSize);
      }
    }
  },

  /**
   * Draws robot placeholders to show the initial positions.
   */
  drawRobotStart(start) {
    const { cellSize, context, cellCoordinates } = this;
    const radius = cellSize / 8;

    context.save();

    start.forEach((robot) => {
      const pos = robot.position;
      const coordinates = cellCoordinates[pos.row][pos.column];
      const x = coordinates.x + (cellSize / 2);
      const y = coordinates.y + (cellSize / 2);

      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI, false);
      context.fillStyle = robot.color;
      context.fill();
    });

    context.restore();
  },

  /**
   * Draws the given moves.
   */
  drawMoves(moves, start) {
    const { cellSize, context, cellCoordinates } = this;
    const positions = {};

    // Make a copy of the current robot positions and update
    // this whilst iterating over the moves to keep track
    // of the next position to draw from.
    start.forEach((robot) => {
      positions[robot.color] = {
        row: robot.position.row,
        column: robot.position.column,
      };
    });

    context.save();

    moves.forEach((move) => {
      const color = move.robot;
      const fromRow = positions[color].row;
      const fromColumn = positions[color].column;
      const from = cellCoordinates[fromRow][fromColumn];
      const to = cellCoordinates[move.to.row][move.to.column];
      const fromX = from.x + (cellSize / 2);
      const fromY = from.y + (cellSize / 2);
      const toX = to.x + (cellSize / 2);
      const toY = to.y + (cellSize / 2);

      context.beginPath();
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.lineWidth = 4;
      context.strokeStyle = color;
      context.stroke();

      // Update robot position.
      positions[color] = {
        row: move.to.row,
        column: move.to.column,
      };
    });

    context.restore();
  },

  /**
   * Draws the given robot.
   */
  drawRobot(robot) {
    const { cellSize, board, context } = this;
    const pos = robot.position;
    const radius = cellSize / 4;
    const selectedRadius = cellSize / 7;
    const coordinates = this.cellCoordinates[pos.row][pos.column];
    const x = coordinates.x + (cellSize / 2);
    const y = coordinates.y + (cellSize / 2);

    // Draw a circle filled with the robot color.
    context.save();
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = robot.color;
    context.fill();
    context.restore();

    // Draw a border around the circle.
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.stroke();

    // If the robot is currently selected, draw a little circle
    // in the middle.
    if (board.isRobotSelected(robot)) {
      context.save();
      context.beginPath();
      context.arc(x, y, selectedRadius, 0, 2 * Math.PI, false);
      context.fillStyle = 'black';
      context.fill();
      context.restore();
    }
  },

  /**
   * Click handler for the canvas.
   */
  click(x, y) {
    const boardPosition = document.querySelector('#board').getBoundingClientRect();
    const topLeftX = boardPosition.x;
    const bottomRightX = boardPosition.x + boardPosition.width;
    const topLeftY = boardPosition.y;
    const bottomRightY = boardPosition.y + boardPosition.height;

    // Correct event coordinates for window scroll.
    x -= (window.pageXOffset || document.documentElement.scrollLeft);
    y -= (window.pageYOffset || document.documentElement.scrollTop);

    // First check if the click is actually on the board.
    if (x >= topLeftX && x <= bottomRightX && y >= topLeftY && y <= bottomRightY) {
      // Translate the click coordinates into cell indices.
      const rowIdx = Math.floor((y - topLeftY) / this.cellSize);
      const columnIdx = Math.floor((x - topLeftX) / this.cellSize);

      this.onClick(rowIdx, columnIdx);
    }
  },
});

BoardCanvas.reopenClass({
  positionalParams: ['board'],
});

export default BoardCanvas;
