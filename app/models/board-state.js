import DS from 'ember-data';

/**
 * Board state.
 */
export default DS.Model.extend({

  /**
   * Holds the robots and their current position
   * on the board.
   */
  robots: null,

  /**
   * The board.
   */
  board: null,

  /**
   * Robot start positions of the current play.
   */
  start: null,

  /**
   * The moves that belong to the current play.
   */
  moves: null,

  /**
   * Whether or not a play has started.
   */
  playStarted: false,

  /**
   * The current goal to work towards.
   */
  currentGoal: null,

  /**
   * The goals that have been completed.
   */
  completedGoals: null,

  /**
   * Holds the currently selected robot.
   */
  selectedRobot: null,

  /**
   * Initialize the robots the random spots on the board.
   */
  init() {
    this._super(...arguments);

    // Reset properties.
    this.reset();

    // Initialize the robots.
    this.initializeRobots();
  },

  /**
   * Reset state properties.
   */
  reset() {
    this.setProperties({
      robots: [],
      moves: [],
      playStarted: false,
      completedGoals: [],
      selectedRobot: null,
    });
  },

  /**
   * Initializes the robots on the board.
   */
  initializeRobots() {
    const board = this.board,
      cells = board.cells,
      nrRows = cells.length,
      nrColumns = nrRows,
      positions = [],
      robots = [],
      start = [];

    // A robot can never be in a cell with four walls.
    for (let i = 0; i < nrRows; i++) {
      for (let j = 0; j < nrColumns; j++) {
        if (cells[i][j] !== 15) {
          positions.push({
            row: i,
            column: j,
          });
        }
      }
    }

    ['yellow', 'red', 'blue', 'green', 'silver'].forEach((color) => {
      let index = Math.floor(Math.random() * positions.length),
        position = positions[index];

      // Remove the position, so no two robots will begin in the same spot.
      positions.removeObject(position);

      // Convert the index to row and column indices.
      robots.push({
        color: color,
        position: {
          row: position.row,
          column: position.column,
        }
      });
      start.push({
        color: color,
        position: {
          row: position.row,
          column: position.column,
        }
      });
    });

    // Also record initial robot positions.
    this.setProperties({
      robots: robots,
      start: start,
    });
  },

  /**
   * Starts a new game.
   */
  startNewGame() {
    // Set a new goal.
    this.set('currentGoal', this.getNextGoal());
  },

  /**
   * Retrieves the next goal to solve.
   */
  getNextGoal() {
    const goals = this.board.goals,
      possibleGoals = goals.unshiftObjects(this.completedGoals),
      index = Math.floor(Math.random() * possibleGoals.length);

   return possibleGoals[index];
  },

  /**
   * Called when a cell is clicked.
   */
  click(row, column) {
    // First determine if a robot or a target cell is clicked.
    const clickedRobot = this.robots.find((robot) => {
      return robot.position.row === row && robot.position.column === column;
    }),
      selectedRobot = this.selectedRobot;

    if (clickedRobot) {
     // Clicked a cell with a robot.
      this.selectedRobot = clickedRobot;
    } else if (selectedRobot) {
      // Clicked on a cell without robot. If a robot is selected
      // and the move is allowed, update the position of the robot.
      const fromRow = selectedRobot.position.row,
        fromColumn = selectedRobot.position.column;

      if (this.canMoveToCell(fromRow, fromColumn, row, column)) {
        this.moveRobotToCell(selectedRobot, row, column);
      }
    }
  },

  /**
   * Moves the given robot to the given cell. Note that this method does not
   * perform any kind of validation.
   */
  moveRobotToCell(robot, row, column) {
    // Record the move.
    this.moves.push({
      robot: robot,
      from: {
        row: robot.position.row,
        column: robot.position.column,
      },
      to: {
        row: row,
        column: column,
      }
    });

    // Update robot position.
    robot.position = {
      row: row,
      column: column,
    };
  },

  /**
   * Determines if going from a cell to a cell is possible.
   */
  canMoveToCell(fromRow, fromColumn, toRow, toColumn) {
    // Since robots can not move diagonally, either the row
    // or the column needs to be equal.
    if (fromRow !== toRow && fromColumn !== toColumn) {
      return false;
    }

    const cells = this.board.cells,
      columnCells = this.board.columnCells;

    if (fromRow === toRow) {
      // We're moving horizontally.
      if (fromColumn < toColumn) {
        // To the right.
        return cells[fromRow].every((cell, idx) => {
          if (idx > fromColumn && idx < toColumn) {
            return this.validPathCell(fromRow, idx, 'right');
          } else if (idx === toColumn) {
            return this.validTargetCell(fromRow, idx, 'right');
          }

          return true;
        });
      } else {
        // To the left.
        return cells[fromRow].every((cell, idx) => {
          if (idx < fromColumn && idx > toColumn) {
            return this.validPathCell(fromRow, idx, 'left');
          } else if (idx === toColumn) {
            return this.validTargetCell(fromRow, idx, 'left');
          }

          return true;
        });
      }
    } else {
      // We're moving vertically.
      if (fromRow < toRow) {
        // Down.
        return columnCells[fromColumn].every((cell, idx) => {
          if (idx < fromRow && idx > toRow) {
            return this.validPathCell(idx, fromColumn, 'down');
          } else if (idx === toRow) {
            return this.validTargetCell(idx, fromColumn, 'down');
          }

          return true;
        });
      } else {
        // Up.
        return columnCells[fromColumn].every((cell, idx) => {
          if (idx > fromRow && idx < toRow) {
            return this.validPathCell(idx, fromColumn, 'up');
          } else if (idx === toRow) {
            return this.validTargetCell(idx, fromColumn, 'up');
          }

          return true;
        });
      }
    }
  },

  /**
   * Returns whether or not the cell specified by the given row and column
   * contains a robot.
   */
  cellContainsRobot(row, column) {
    return this.robots.any((robot) => {
      const pos = robot.position;

      return pos.row === row && pos.column === column;
    });
  },

  /**
   * Determines if the given cell is a valid path cell, coming in from the given
   * direction. A path cell is a cell that is traversed on the way to a target
   * cell.
   */
  validPathCell(row, column, direction) {
    const cells = this.board.cells;

    // A path cell can never contain a robot.
    let result = !this.cellContainsRobot(row, column);

    switch(direction) {
      case 'up':
        result = result && !(cells[row][column] & 4);
        break;
      case 'right':
        result = result && !(cells[row][column] & 8);
        break;
      case 'down':
        result = result && !(cells[row][column] & 1);
        break;
      case 'left':
        result = result && !(cells[row][column] & 2);
        break;
      default:
        result = false;
    }

    return result;
  },

  /**
   * Determines if the given cell is a valid target cell, coming in from the
   * given direction.
   */
  validTargetCell(row, column, direction) {
    const cells = this.board.cells;
    let result = null;

    switch(direction) {
      case 'up':
        result = !!(cells[row][column] & 1) || (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row - 1, column));
        break;
      case 'right':
        result = !!(cells[row][column] & 2) || (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row, column + 1));
        break;
      case 'down':
        result = !!(cells[row][column] & 4) || (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row + 1, column));
        break;
      case 'left':
        result = !!(cells[row][column] & 8) || (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row, column - 1));
        break;
    }

    return result;
  },

  /**
   * Determines if the given cell has a cell next to it in the given direction.
   */
  nextCellExists(row, column, direction) {
    const cells = this.board.cells;

    switch(direction) {
      case 'up':
        return (row - 1) >= 0;
      case 'right':
        return (column + 1) <= (cells[row].length - 1);
      case 'down':
        return (row + 1) <= (cells.length - 1);
      case 'left':
        return (column - 1) >= 0;
    }
  },
});
