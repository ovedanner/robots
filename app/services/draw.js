import Service from '@ember/service';

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
  cellColor: '#ECDED1',

  /**
   * Size of a single cell.
   */
  cellSize: 50,

  /**
   * Color of the cell walls.
   */
  wallColor: '#7D7B7A',

  /**
   * Holds the board to draw.
   */
  board: null,
  nrRows: null,
  nrColumns: null,

  /**
   * Caches cell coordinates for easy lookup.
   */
  cellCoordinates: null,
  topLeft: null,
  bottomRight: null,

  /**
   * Intializes the service with the given
   * board.
   */
  initialize(board) {
    const cells = board.cells,
      context = this.context,
      canvas = context.canvas,
      cellCoordinates = [],
      cellSize = this.cellSize,
      nrRows = cells.length,
      nrColumns = nrRows,
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
      cellCoordinates: cellCoordinates,
      topLeft: {
        x: xStart,
        y: yStart,
      },
      bottomRight: {
        x: xStart + (nrColumns * cellSize),
        y: yStart + (nrRows * cellSize),
      },
      nrRows: nrRows,
      nrColumns: nrColumns,
    });
  },


  /**
   * Draws the current board.
   */
  draw() {
    const board = this.board,
      state = board.state,
      cells = board.cells,
      nrRows = cells.length,
      nrColumns = nrRows,
      context = this.context,
      canvas = context.canvas;

    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    // First draw the cells.
    cells.forEach((row, rowIdx) => {
      row.forEach((column, columnIdx) => {
        let coordinates = this.cellCoordinates[rowIdx][columnIdx];

        this.drawCell(cells[rowIdx][columnIdx], coordinates.x, coordinates.y);
      });
    });

    // Draw the goal, the robots and the paths.
    if (state) {
      if (state.currentGoal) {
        const number = state.currentGoal.number,
          rowIdx = Math.floor(number / nrRows),
          columnIdx = number % nrColumns,
          coordinates = this.cellCoordinates[rowIdx][columnIdx];

        this.drawGoal(state.currentGoal, coordinates.x, coordinates.y);
      }

      state.robots.forEach((robot) => {
        this.drawRobot(robot);
      });
    }
  },

  /**
   * Draws the given cell at the given coordinates.
   */
  drawCell(cell, x, y) {
    let context = this.context,
      size = this.cellSize,
      backgroundColor = this.cellColor,
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
      context.fillStyle = backgroundColor;
      context.fillRect(x, y, size, size);

      // Background cell borders.
      context.strokeStyle = '#3B3E40';
      context.strokeRect(x, y, size, size);

      if (top) {
        context.fillStyle = wallColor;
        context.fillRect(x, y, size, 1);
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
   * Draws the given goal.
   */
  drawGoal(goal, x, y) {
    let context = this.context,
      size = this.cellSize,
      backgroundColor = goal.color;

    context.fillStyle = backgroundColor;
    context.fillRect(x, y, size, size);
  },

  /**
   * Draws the path the given robot has taken so far.
   */
  //drawRobotPath(robot) {
  //  let path = robot.path,
  //    context = this.context,
  //    from,
  //    to;

  //  context.save();
  //  if (path.get('length') > 1) {
  //    for (let i = 0; i < (path.get('length') - 1); i++) {
  //      // Draw a small circle at the first cell of the path
  //      // to indicate that the robot used to be here.
  //      if (i === 0) {
  //        context.beginPath();
  //        context.arc(path[i].get('xCenter'), path[i].get('yCenter'),
  //          path[i].get('size') / 8, 0, 2 * Math.PI, false);
  //        context.fillStyle = robot.color;
  //        context.fill();
  //      }
  //      from = path[i];
  //      to = path[i + 1];
  //      context.beginPath();
  //      context.moveTo(from.get('xCenter'), from.get('yCenter'));
  //      context.lineTo(to.get('xCenter'), to.get('yCenter'));
  //      context.lineWidth = 4;
  //      context.strokeStyle = robot.color;
  //      context.stroke();
  //    }
  //  }
  //  context.restore();
  //},

  /**
   * Draws the given robot.
   */
  drawRobot(robot) {
    let pos = robot.position,
      size = this.cellSize,
      radius = size / 4,
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
  },

  /**
   * Click handler for the canvas.
   */
  click(x, y) {
    const topLeft = this.topLeft,
      bottomRight = this.bottomRight;

    // First check if the click is actually on the board.
    if (x >= topLeft.x && x <= bottomRight.x && y >= topLeft.y && y <= bottomRight.y) {
      // Translate the click coordinates into cell indices and let the state handle it.
      const rowIdx = Math.floor((y - topLeft.y) / this.cellSize),
        columnIdx = Math.floor((x - topLeft.x) / this.cellSize);

      this.board.state.click(rowIdx, columnIdx);
    }
  },
});
