import DS from 'ember-data';
import { inject as service } from '@ember/service';

/**
 * Board state.
 */
export default DS.Model.extend({
  /**
   * Game service.
   */
  gameService: service('game'),

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
   * Initializes the robots on the board.
   */
  initializeRobots() {
    const board = this.board,
      cells = board.cells,
      nrRows = board.nrRows,
      nrColumns = board.nrColumns,
      positions = [],
      robots = [];

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

    board.robotColors.forEach((color) => {
      let index = Math.floor(Math.random() * positions.length),
        position = positions[index];

      // Remove the position, so no two robots will begin in the same spot.
      positions.removeObject(position);

      // Convert the index to row and column indices.
      robots.pushObject({
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
      selectedRobot: null,
      moves: [],
    });
  },

  /**
   * Resets the robots to the start of the play.
   */
  resetRobotsToStart() {
    const robots = this.robots,
      start = this.start;

    start.forEach((startPos) => {
      const robot = robots.findBy('color', startPos.color);

      robot.position = JSON.parse(JSON.stringify(startPos.position));
    });

    this.set('moves', []);
  },

  /**
   * Sets the goal to work towards.
   * @param goal
   */
  setCurrentGoal(goal) {
    // Make sure the start positions equal those of the robots.
    let start = this.robots.map((robot) => {
      return JSON.parse(JSON.stringify(robot));
    });

    this.setProperties({
      currentGoal: goal,
      moves: [],
      start: start,
      selectedRobot: null,
    })
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
    this.moves.pushObject({
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

    // Check if the goal was reached by the appropriate robot.
    if (this.currentGoal && this.currentGoal.color === robot.color) {
      const [goalRowIdx, goalColumnIdx] = this.board.getGoalIndices(this.currentGoal);

      if (row === goalRowIdx && column === goalColumnIdx) {
        this.gameService.goalReached(this.board, this.currentGoal);
      }
    }
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
          } else if (idx === fromColumn) {
            // Start cell can't have a right wall.
            return (cells[fromRow][fromColumn] & 2) === 0;
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
          } else if (idx === fromColumn) {
            // Start cell can't have a left wall.
            return (cells[fromRow][fromColumn] & 8) === 0;
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
          } else if (idx === fromRow) {
            // Start cell can't have a bottom wall.
            return (cells[fromRow][fromColumn] & 4) === 0;
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
          } else if (idx === fromRow) {
            // Start cell can't have a top wall.
            return (cells[fromRow][fromColumn] & 1) === 0;
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
   * cell, but not the start or finish cell.
   */
  validPathCell(row, column, direction) {
    const cells = this.board.cells;

    // A path cell can never contain a robot.
    let result = !this.cellContainsRobot(row, column);

    switch (direction) {
      case 'up':
      case 'down':
        result = result && (cells[row][column] & 5) === 0;
        break;
      case 'left':
      case 'right':
        result = result && (cells[row][column] & 10) === 0;
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
        result = (cells[row][column] & 1) > 0 ||
          (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row - 1, column));
        break;
      case 'right':
        result = (cells[row][column] & 2) > 0 ||
          (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row, column + 1));
        break;
      case 'down':
        result = (cells[row][column] & 4) > 0 ||
          (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row + 1, column));
        break;
      case 'left':
        result = (cells[row][column] & 8) > 0 ||
          (this.nextCellExists(row, column, direction) && this.cellContainsRobot(row, column - 1));
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

  /**
   * Determines if the given robot is currently selected.
   * @param robot
   * @returns {boolean}
   */
  isRobotSelected(robot) {
    return !!this.selectedRobot && this.selectedRobot.color === robot.color;
  }
});