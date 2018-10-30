import Service from '@ember/service';
import { computed } from '@ember/object';

/**
 * Map of goal color name to actual RGB value.
 * @type {{blue: string, red: string, yellow: string, green: string}}
 */
const colorMap = {
  blue: '#7EA7D2',
  red: '#F58C8F',
  yellow: '#FEF87D',
  green: '#C3E17E'
};

/**
 * Service responsible for drawing the board.
 */
export default Service.extend({

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
  cellColor: '#FFFFFF',

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
   * Holds the board to draw.
   */
  board: null,

  /**
   * Caches cell coordinates for easy lookup.
   */
  cellCoordinates: null,

  /**
   * Intializes the service with the given
   * board and context.
   */
  initialize(board, context) {
    const cells = board.cells,
      canvas = context.canvas,
      cellCoordinates = [],
      cellSize = this.cellSize,
      nrRows = board.nrRows,
      nrColumns = board.nrColumns,
      xStart = parseInt((canvas.clientWidth - (nrColumns * cellSize)) / 2),
      yStart = parseInt((canvas.clientHeight - (nrRows * cellSize)) / 2);

    // Cache cell coordinates.
    cells.forEach((row, rowIdx) => {
      cellCoordinates.push([]);
      row.forEach((column, columnIdx) => {
        let x = xStart + (columnIdx * cellSize),
          y = yStart + (rowIdx * cellSize);

        cellCoordinates[rowIdx].push({
          x: x,
          y: y,
        });
      });
    });

    this.setProperties({
      board: board,
      context: context,
      cellCoordinates: cellCoordinates,
    });
  },


  /**
   * Draws the current board. The draw order is:
   * - Cells (and walls)
   * - Robot paths
   * - Robots
   */
  draw() {
    const board = this.board,
      state = board.state,
      cells = board.cells,
      nrRows = cells.length,
      nrColumns = nrRows,
      context = this.context,
      canvas = context.canvas;
    let goalColor,
      goalRowIdx,
      goalColumnIdx;

    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // If there is a current goal, get its target cell.
    if (state && state.currentGoal) {
      const number = state.currentGoal.number;

      goalColor = state.currentGoal.color;
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
    if (state) {
      if (state.moves && state.moves.length > 0) {
        this.drawRobotStart(state.start);
        this.drawMoves(state.moves);
      }

      if (state.robots) {
        state.robots.forEach((robot) => {
          this.drawRobot(robot);
        });
      }
    }
  },

  /**
   * Draws the given cell at the given coordinates.
   */
  drawCell(cell, x, y, color) {
    let context = this.context,
      size = this.cellSize,
      wallColor = this.wallColor,
      wallSize = this.wallSize,
      top = (cell & 1) > 0,
      right = (cell & 2) > 0,
      bottom = (cell & 4) > 0,
      left = (cell & 8) > 0;

    // Cells with four walls are colored in.
    if (cell === 15) {
      context.fillStyle = 'gray';
      context.fillRect(x, y, size, size);
    } else {
      context.fillStyle = color;
      context.fillRect(x, y, size, size);

      // Background cell borders.
      context.strokeStyle = '#3B3E40';
      context.strokeRect(x, y, size, size);

      if (top) {
        context.fillStyle = wallColor;
        context.fillRect(x, y, size, wallSize);
      }
      if (right) {
        context.fillStyle = wallColor;
        context.fillRect((x + size) - wallSize, y, wallSize, size);
      }
      if (bottom) {
        context.fillStyle = wallColor;
        context.fillRect(x, (y + size) - wallSize, size, wallSize);
      }
      if (left) {
        context.fillStyle = wallColor;
        context.fillRect(x, y, wallSize, size);
      }
    }
  },

  /**
   * Draws robot placeholders to show the initial positions.
   */
  drawRobotStart(start) {
    const size = this.cellSize,
      radius = size / 8,
      context = this.context,
      cellCoordinates = this.cellCoordinates;

    context.save();

    start.forEach((robot) => {
      const pos = robot.position,
        coordinates = cellCoordinates[pos.row][pos.column],
        x = coordinates.x + (size / 2),
        y = coordinates.y + (size / 2);

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
  drawMoves(moves) {
    let size = this.cellSize,
      context = this.context,
      cellCoordinates = this.cellCoordinates;

    context.save();

    moves.forEach((move) => {
      const from = cellCoordinates[move.from.row][move.from.column],
        to = cellCoordinates[move.to.row][move.to.column],
        color = move.robot.color,
        fromX = from.x + (size / 2),
        fromY = from.y + (size / 2),
        toX = to.x + (size / 2),
        toY = to.y + (size / 2);

      context.beginPath();
      context.moveTo(fromX, fromY);
      context.lineTo(toX, toY);
      context.lineWidth = 4;
      context.strokeStyle = color;
      context.stroke();
    });

    context.restore();
  },

  /**
   * Draws the given robot.
   */
  drawRobot(robot) {
    const pos = robot.position,
      size = this.cellSize,
      radius = size / 4,
      selectedRadius = size / 7,
      board = this.board,
      context = this.context,
      coordinates = this.cellCoordinates[pos.row][pos.column],
      x = coordinates.x + (size / 2),
      y = coordinates.y + (size / 2);

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
    const boardPosition = document.querySelector('#board').getBoundingClientRect(),
      topLeftX = boardPosition.x,
      bottomRightX = boardPosition.x + boardPosition.width,
      topLeftY = boardPosition.y,
      bottomRightY = boardPosition.y + boardPosition.height;

    // First check if the click is actually on the board.
    if (x >= topLeftX && x <= bottomRightX && y >= topLeftY && y <= bottomRightY) {
      // Translate the click coordinates into cell indices and let the state handle it.
      const rowIdx = Math.floor((y - topLeftY) / this.cellSize),
        columnIdx = Math.floor((x - topLeftX) / this.cellSize);

      this.board.state.click(rowIdx, columnIdx);
    }
  },
});
