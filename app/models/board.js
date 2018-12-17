import DS from 'ember-data';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

/**
 * Represents a board.
 */
export default DS.Model.extend({
  /**
   * Game service.
   */
  gameService: service('game'),

  /**
   * Cells of the board, defined by their walls.
   */
  cells: DS.attr(),

  /**
   * Goal cells of the board
   */
  goals: DS.attr(),

  /**
   * Robots that can participate.
   */
  robotColors: DS.attr(),

  /**
   * Whether or not this board is finished (all goals are reached).
   */
  finished: false,

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
   * The current goal to work towards.
   */
  currentGoal: null,

  /**
   * Holds the currently selected robot.
   */
  selectedRobot: null,

  /**
   * Returns an array of column cells instead of row cells.
   */
  columnCells: computed('cells.length', function () {
    const columns = [];

    for (let i = 0; i < this.cells.length; i++) {
      const column = [];

      for (let j = 0; j < this.cells.length; j++) {
        column.push(this.cells[j][i]);
      }

      columns.push(column);
    }

    return columns;
  }),

  /**
   * We assume square boards with at least one cell.
   */
  nrRows: readOnly('cells.length'),
  nrColumns: readOnly('cells.0.length'),

  /**
   * Initializes the robots on the board.
   */
  initializeRobots() {
    const positions = [];
    const robots = [];

    // A robot can never be in a cell with four walls.
    for (let i = 0; i < this.nrRows; i++) {
      for (let j = 0; j < this.nrColumns; j++) {
        if (this.cells[i][j] !== 15) {
          positions.push({
            row: i,
            column: j,
          });
        }
      }
    }

    this.robotColors.forEach((color) => {
      const index = Math.floor(Math.random() * positions.length);
      const position = positions[index];

      // Remove the position, so no two robots will begin in the same spot.
      positions.removeObject(position);

      // Convert the index to row and column indices.
      robots.pushObject({
        robot: color,
        position: {
          row: position.row,
          column: position.column,
        },
      });
    });

    // Also record initial robot positions.
    this.setProperties({
      robots,
      selectedRobot: null,
      moves: [],
    });
  },

  /**
   * Sets the robots to the given positions.
   * @param positions
   */
  setRobotPositions(positions) {
    // Make sure the start positions equal those of the robots.
    const start = positions.map((robot) => {
      return JSON.parse(JSON.stringify(robot));
    });

    this.setProperties({
      start,
      robots: positions,
      selectedRobot: null,
      moves: [],
    });
  },

  /**
   * Resets the robots to the start of the play.
   */
  resetRobotsToStart() {
    this.start.forEach((startPos) => {
      const robot = this.robots.findBy('robot', startPos.robot);

      robot.position = JSON.parse(JSON.stringify(startPos.position));
    });

    this.set('moves', []);
  },

  /**
   * Sets the goal to work towards.
   * @param goal
   */
  setCurrentGoal(goal) {
    this.setProperties({
      currentGoal: goal,
      moves: [],
      selectedRobot: null,
    });
  },

  /**
   * Called when a cell is clicked. Returns `true` if the current goal
   * is reached and `false` otherwise.
   */
  click(row, column) {
    // First determine if a robot or a target cell is clicked.
    const clickedRobot = this.robots.find((robot) => {
      return robot.position.row === row && robot.position.column === column;
    });

    if (clickedRobot) {
      // Clicked a cell with a robot.
      this.set('selectedRobot', clickedRobot);
    } else if (this.selectedRobot) {
      // Clicked on a cell without robot. If a robot is selected
      // and the move is allowed, update the position of the robot.
      const fromRow = this.selectedRobot.position.row;
      const fromColumn = this.selectedRobot.position.column;

      if (this.canMoveToCell(fromRow, fromColumn, row, column)) {
        return this.moveRobotToCell(this.selectedRobot, row, column);
      }
    }

    return false;
  },

  /**
   * Moves the given robot to the given cell. Note that this method does not
   * perform any kind of validation. Returns `true` if the current goal is reached
   * by the right robot and `false` otherwise.
   */
  moveRobotToCell(robot, row, column) {
    // Record the move.
    this.moves.pushObject({
      robot: robot.robot,
      to: {
        row,
        column,
      },
    });

    // Update robot position.
    robot.position = {
      row,
      column,
    };

    // Check if the goal was reached by the appropriate robot.
    if (this.currentGoal && this.currentGoal.color === robot.robot) {
      const [goalRowIdx, goalColumnIdx] = this.getGoalIndices(this.currentGoal);

      if (row === goalRowIdx && column === goalColumnIdx) {
        return true;
      }
    }

    return false;
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

    if (fromRow === toRow) {
      // We're moving horizontally.
      if (fromColumn < toColumn) {
        // To the right.
        return this.cells[fromRow].every((cell, idx) => {
          if (idx > fromColumn && idx < toColumn) {
            return this.validPathCell(fromRow, idx, 'right');
          }
          if (idx === toColumn) {
            return this.validTargetCell(fromRow, idx, 'right');
          }
          if (idx === fromColumn) {
            // Start cell can't have a right wall.
            return (this.cells[fromRow][fromColumn] & 2) === 0;
          }

          return true;
        });
      }

      // To the left.
      return this.cells[fromRow].every((cell, idx) => {
        if (idx < fromColumn && idx > toColumn) {
          return this.validPathCell(fromRow, idx, 'left');
        }
        if (idx === toColumn) {
          return this.validTargetCell(fromRow, idx, 'left');
        }
        if (idx === fromColumn) {
          // Start cell can't have a left wall.
          return (this.cells[fromRow][fromColumn] & 8) === 0;
        }

        return true;
      });
    }

    // We're moving vertically.
    if (fromRow < toRow) {
      // Down.
      return this.columnCells[fromColumn].every((cell, idx) => {
        if (idx < fromRow && idx > toRow) {
          return this.validPathCell(idx, fromColumn, 'down');
        }
        if (idx === toRow) {
          return this.validTargetCell(idx, fromColumn, 'down');
        }
        if (idx === fromRow) {
          // Start cell can't have a bottom wall.
          return (this.cells[fromRow][fromColumn] & 4) === 0;
        }

        return true;
      });
    }
    // Up.
    return this.columnCells[fromColumn].every((cell, idx) => {
      if (idx > fromRow && idx < toRow) {
        return this.validPathCell(idx, fromColumn, 'up');
      }
      if (idx === toRow) {
        return this.validTargetCell(idx, fromColumn, 'up');
      }
      if (idx === fromRow) {
        // Start cell can't have a top wall.
        return (this.cells[fromRow][fromColumn] & 1) === 0;
      }

      return true;
    });
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
   * cell, but not the start or finish cell.
   */
  validPathCell(row, column, direction) {
    // A path cell can never contain a robot.
    let result = !this.cellContainsRobot(row, column);

    switch (direction) {
      case 'up':
      case 'down':
        result = result && (this.cells[row][column] & 5) === 0;
        break;
      case 'left':
      case 'right':
        result = result && (this.cells[row][column] & 10) === 0;
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
    switch (direction) {
      case 'up':
        return (this.cells[row][column] & 1) > 0 ||
          (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row - 1, column));
      case 'right':
        return (this.cells[row][column] & 2) > 0 ||
          (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row, column + 1));
      case 'down':
        return (this.cells[row][column] & 4) > 0 ||
          (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row + 1, column));
      case 'left':
        return (this.cells[row][column] & 8) > 0 ||
          (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row, column - 1));
      default:
        return null;
    }
  },

  /**
   * Determines if the given cell has a cell next to it in the given direction.
   */
  nextCellExists(row, column, direction) {
    switch (direction) {
      case 'up':
        return (row - 1) >= 0;
      case 'right':
        return (column + 1) <= (this.cells[row].length - 1);
      case 'down':
        return (row + 1) <= (this.cells.length - 1);
      case 'left':
        return (column - 1) >= 0;
      default:
        return false;
    }
  },

  /**
   * Determines if the given robot is currently selected.
   * @param robot
   * @returns {boolean}
   */
  isRobotSelected(robot) {
    return !!this.selectedRobot && this.selectedRobot.robot === robot.robot;
  },

  /**
   * Returns an array with the row and column index of
   * the given goal.
   * @param goal
   * @returns {number[]}
   */
  getGoalIndices(goal) {
    const goalRowIdx = Math.floor(goal.number / this.nrRows);
    const goalColumnIdx = goal.number % this.nrColumns;

    return [goalRowIdx, goalColumnIdx];
  },

  /**
   * Returns a unique identifier for the goal.
   * @param goal
   * @returns {string}
   */
  getGoalId(goal) {
    return `${goal.color}_${goal.number}`;
  },
});
