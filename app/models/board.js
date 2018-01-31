import Ember from 'ember';
import Cell from 'ricochet-robots/models/cell';
import BoardLayout from 'ricochet-robots/models/board-layout';
import Robot from 'ricochet-robots/models/robot';

/**
 * Represents a board.
 */
export default Ember.Object.extend({
  /**
   * Contains the rendering context.
   */
  context: null,

  /**
   * Holds all the board's cells.
   */
  cells: [],

  /**
   * Holds the robots.
   */
  robots: [],

  /**
   * Holds the currently selected robot.
   */
  selectedRobot: null,

  /**
   * Draws the board and everything on it.
   */
  initialize() {
    let context = this.get('context'),
      cells = [],
      canvas = context.canvas,
      fullWidth = canvas.clientWidth - 40,
      fullHeight = canvas.clientHeight - 40,
      cellSize, margin, landscape = true;

    if (fullHeight < fullWidth) {
      margin = (fullWidth - fullHeight) / 2;
      cellSize = (fullHeight - (fullHeight % 16)) / 16;
    } else {
      landscape = false;
      margin = (fullHeight - fullWidth) / 2;
      cellSize = (fullWidth - (fullWidth % 16)) / 16;
    }

    // Load the board layout.
    let layout = BoardLayout.create(),
      walls = layout.get('walls');

    // Create the cells.
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        let xPos = (x * cellSize) + (landscape ? margin : 20),
          yPos = (y * cellSize) + (landscape ? 20 : margin),
          cell = Cell.create({
            x: xPos,
            y: yPos,
            walls: walls[y][x],
            size: cellSize,
            context: context,
            number: (x + (y * 16)) + 1
          });
        cells.pushObject(cell);
      }
    }

    // Set the cells on the board.
    this.set('cells', cells);

    // Randomly initialize the robots.
    this.initializeRobots();
  },

  /**
   * Initializes the robots to random cells of the board.
   */
  initializeRobots() {
    let context = this.get('context'),
      cells = this.get('cells'),
      indices = [],
      robots = [];

    // Make sure a robot can never be in the center of the board.
    for (let i = 0; i < 256; i++) {
      if (i !== 119 && i !== 120 && i !== 135 && i !== 136) {
        indices.push(i);
      }
    }

    ['yellow', 'red', 'blue', 'green', 'silver'].forEach((color) => {
      let index = Math.floor((Math.random() * indices.get('length')) + 1),
        cell = cells.get(indices.get(index));

      // Remove the index, so no two robots will begin in the same spot.
      indices.removeObject(index);
      let robot = Robot.create({
        cell: cell,
        color: color,
        context: context
      });
      cell.set('robot', robot);
      robots.pushObject(robot);
    });

    this.set('robots', robots);
  },

  /**
   * Click handler registered on the canvas.
   * @param x
   * @param y
   */
  click(x, y) {
    let currentlySelectedRobot = this.get('selectedRobot');

    // If there already is a robot selected, see which cell is
    // being clicked (if any). Otherwise, find a selected robot.
    if (currentlySelectedRobot) {
      let selectedCell = this.get('cells').find((cell) => {
        let cellSize = cell.get('size'),
          xCell = cell.get('x'),
          yCell = cell.get('y');
        return (x > xCell && x < (xCell + cellSize)) && (y > yCell && y < (yCell + cellSize));
      });

      if (selectedCell && this.canRobotMoveToCell(currentlySelectedRobot, selectedCell)) {
        currentlySelectedRobot.set('cell', selectedCell);
        selectedCell.set('robot', currentlySelectedRobot);
      }
    } else {
      let selectedRobot = this.get('robots').find((robot) => {
        let radius = robot.get('radius'),
          xCenter = robot.get('x'),
          yCenter = robot.get('y');
        return Math.sqrt(Math.pow((x - xCenter), 2) + Math.pow((y - yCenter), 2)) < radius;
      });

      if (selectedRobot) {
        this.set('selectedRobot', selectedRobot);
      }
    }
  },

  /**
   * Draws the board and everything on it.
   */
  draw() {
    let context = this.get('context'),
      cells = this.get('cells'),
      robots = this.get('robots'),

      // We can determine the area to clear based
      // on the first cell.
      x = cells[0].get('x'),
      y = cells[0].get('y'),
      size = cells[0].get('size') * 16;
    context.clearRect(x, y, size, size);

    // First draw the cells.
    cells.forEach((cell) => {
      cell.draw();
    });

    // Now draw the robots.
    robots.forEach((robot) => {
      robot.draw();
    });
  },

  /**
   * Determines if the given robot can move to the given cell.
   * @param robot
   * @param cell
   * @returns {boolean}
   */
  canRobotMoveToCell(robot, cell) {
    let cells = this.get('cells'),
      robotCell = robot.get('cell');

    // Already on the cell.
    if (robotCell === cell) {
      return false;
    }

    // First of all, robots can only move in straight lines.
    if ((cell.get('x') !== robotCell.get('x')) && (cell.get('y') !== robotCell.get('y'))) {
      return false;
    }

    // Now make sure the robot doesn't go through walls or other robots.
    if (cell.get('y') === robotCell.get('y')) {

      // Robot cell and target cell are on the same row. Check if the target
      // cell is to the left or to the right.
      if (robotCell.get('number') > cell.get('number')) {
        let diff = robotCell.get('number') - cell.get('number');
        while (diff > 0) {
          let cellToCheck = cells.get(cell.get('number') - 1);
          if (!cellToCheck.get('hasLeftWall') && !cellToCheck.get('robot')) {
            return false;
          }
          diff--;
        }
        return true;
      }
    } else {

    }

    return true;
  }

});
