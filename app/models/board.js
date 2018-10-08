import DS from 'ember-data';
import BoardState from './board-state';

/**
 * Represents a board.
 */
export default DS.Model.extend({

  /**
   * Cells of the board, defined by their walls.
   */
  cells: DS.attr(),

  /**
   * Goal cells of the board
   */
  goals: DS.attr(),

  /**
   * Board state.
   */
  state: null,

  /**
   * Instantiate a new board state.
   */
  init() {
    this._super(...arguments);

    this.set('state', BoardState.create({
      board: this,
    }));
  },

  /**
   * Click handler registered on the canvas.
   * @param x
   * @param y
   */
  click(x, y) {
    let selectedRobot = this.get('robots').find((robot) => {
      let radius = robot.get('radius'),
        xCenter = robot.get('x'),
        yCenter = robot.get('y');

      return Math.sqrt(Math.pow((x - xCenter), 2) + Math.pow((y - yCenter), 2)) < radius;
    }), currentGoal = this.get('currentGoal');

    if (selectedRobot) {
      this.set('selectedRobot', selectedRobot);
    } else {
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

        // Robot can move to the cell. Increment the number of steps and check if we have
        // reached the goal.
        if (selectedCell && this.canRobotMoveToCell(currentlySelectedRobot, selectedCell)) {
          currentlySelectedRobot.set('targetCell', selectedCell);
          this.set('currentNrOfMoves', this.get('currentNrOfMoves') + 1);

          if (selectedCell.get('goal') === currentGoal &&
            currentlySelectedRobot.get('color') === currentGoal.get('color')) {
            this.goalReached(selectedCell);
          }
        }
      }
    }
  },

  /**
   * Determines if the given robot can move to the given target cell.
   * @param robot
   * @param targetCell
   * @returns {boolean}
   */
  canRobotMoveToCell(robot, targetCell) {
    let path = this.getPath(robot, targetCell);

    // No path between the robot and the target
    // cell? Then we can't move.
    if (!path) {
      return false;
    }

    let cells = path.cells,
      targetCondition = false,
      robots = this.get('robots'),
      cellsWithRobots = robots.map((robot) => {
        return robot.get('cell');
      }),
      currentNumber = robot.get('cell.number'),
      targetNumber = targetCell.get('number');

    switch (path.direction) {
      case 'up':
        // The target cell either needs to have a top wall
        // or the cell above that needs to have a robot.
        if (targetCell.get('hasTopWall')) {
          targetCondition = true;
        } else {
          targetCondition = cellsWithRobots.any((cell) => {
            return cell.get('number') === (targetNumber - 16);
          });
        }

        return targetCondition && cells.every((cell) => {
          let number = cell.get('number');
          if (number === currentNumber) {
            return !cell.get('hasTopWall');
          } else if (number === targetNumber) {
            return true;
          } else {
            return !cell.get('hasTopWall') && !cellsWithRobots.includes(cell);
          }
        });
      case 'down':
        // The target cell either needs to have a bottom wall
        // or the cell below that needs to have a robot.
        if (targetCell.get('hasBottomWall')) {
          targetCondition = true;
        } else {
          targetCondition = cellsWithRobots.any((cell) => {
            return cell.get('number') === (targetNumber + 16);
          });
        }

        return targetCondition && cells.every((cell) => {
          let number = cell.get('number');
          if (number === currentNumber) {
            return !cell.get('hasBottomWall');
          } else if (number === targetNumber) {
            return true;
          } else {
            return !cell.get('hasBottomWall') && !cellsWithRobots.includes(cell);
          }
        });
      case 'left':
        // The target cell either needs to have a left wall
        // or the cell to the left of that one needs to have
        // a robot.
        if (targetCell.get('hasLeftWall')) {
          targetCondition = true;
        } else {
          targetCondition = cellsWithRobots.any((cell) => {
            return cell.get('number') === (targetNumber - 1);
          });
        }

        return targetCondition && cells.every((cell) => {
          let number = cell.get('number');
          if (number === currentNumber) {
            return !cell.get('hasLeftWall');
          } else if (number === targetNumber) {
            return true;
          } else {
            return !cell.get('hasLeftWall') && !cellsWithRobots.includes(cell);
          }
        });
      case 'right':
        // The target cell either needs to have a right wall
        // or the cell to the right of that one needs to have
        // a robot.
        if (targetCell.get('hasRightWall')) {
          targetCondition = true;
        } else {
          targetCondition = cellsWithRobots.any((cell) => {
            return cell.get('number') === (targetNumber + 1);
          });
        }

        return targetCondition && cells.every((cell) => {
          let number = cell.get('number');
          if (number === currentNumber) {
            return !cell.get('hasRightWall');
          } else if (number === targetNumber) {
            return true;
          } else {
            return !cell.get('hasRightWall') && !cellsWithRobots.includes(cell);
          }
        });
    }
  },

  /**
   * Retrieves cells on the line between the robot and the given
   * target cell.
   * @param robot
   * @param targetCell
   * @returns {*}
   */
  getPath(robot, targetCell) {
    let cells = this.get('cells'),
      currentCell = robot.get('cell'),
      currentNumber = currentCell.get('number'),
      targetNumber = targetCell.get('number');

    // Already on the cell.
    if (currentCell === targetCell) {
      return null;
    }

    // First of all, robots can only move in straight lines.
    if ((targetCell.get('x') !== currentCell.get('x')) && (targetCell.get('y') !== currentCell.get('y'))) {
      return null;
    }

    // In this case we're moving horizontally.
    if (targetCell.get('y') === currentCell.get('y')) {
      // We're moving right.
      if (targetNumber > currentNumber) {
        return {
          direction: 'right',
          cells: cells.filter((cell) => {
            let number = cell.get('number');
            return currentNumber <= number && number <= targetNumber;
          })
        };
      } else {
        // We're moving left.
        return {
          direction: 'left',
          cells: cells.filter((cell) => {
            let number = cell.get('number');
            return targetNumber <= number && number <= currentNumber;
          })
        };
      }
    } else {
      // We're moving vertically.
      if (targetNumber > currentNumber) {
        return {
          direction: 'down',
          cells: cells.filter((cell) => {
            let number = cell.get('number');
            return currentNumber <= number && number <= targetNumber && ((number - currentNumber) % 16 === 0);
          })
        };
      } else {
        // We're moving upwards.
        return {
          direction: 'up',
          cells: cells.filter((cell) => {
            let number = cell.get('number');
            return targetNumber <= number && number <= currentNumber && ((number - targetNumber) % 16 === 0);
          })
        };
      }
    }
  },

  /**
   * Makes a snapshot of the current board state.
   */
  snapshot() {
    let cells = this.get('cells'),
      robots = this.get('robots'),
      currentGoal = this.get('currentGoal');
    cells.forEach((cell) => {
      cell.snapshot();
    });
    robots.forEach((robot) => {
      robot.snapshot();
    });
    currentGoal.snapshot();
    let _snapshot = this.getProperties('cells', 'robots', 'selectedRobot',
      'currentGoal', 'currentGoal', 'currentNrOfMoves');
    this.set('_snapshot', _snapshot);
  },

  /**
   * Restores the board to the last saved board state.
   */
  restore() {
    this.setProperties(this.get('_snapshot'));
    let cells = this.get('cells'),
      robots = this.get('robots'),
      currentGoal = this.get('currentGoal');
    cells.forEach((cell) => {
      cell.restore();
    });
    robots.forEach((robot) => {
      robot.restore();
    });
    currentGoal.restore();
  },

  /**
   * Sets a new goal from the remaining goals.
   */
  setNewGoal() {
    let currentGoal = this.get('currentGoal');
    if (currentGoal) {
      currentGoal.set('current', false);
    }

    // Get all goals that have not been reached.
    let remainingGoals = this.get('goals').filter((goal) => {
      return !goal.get('reached');
    });

    // Is there a goal left?
    if (currentGoal && remainingGoals.get('length') < 1) {
      return false;
    }

    // If there is, randomly draw one.
    let index = Math.floor((Math.random() * remainingGoals.get('length'))),
      newGoal = remainingGoals[index];

    newGoal.set('current', true);
    this.set('currentGoal', newGoal);

    return true;
  },

  /**
   * Called when the current goal on the given cell has been reached.
   */
  goalReached(cell) {
    this.set('currentNrOfMoves', 0);

    // Mark the goal as reached.
    cell.get('goal').set('reached', true);

    // Clear the current robot paths.
    this.get('robots').forEach((robot) => {
      robot.set('path', []);
    });

    // Set a new goal if possible.
    if (!this.setNewGoal()) {
      //console.log('FINISHED!!!');
    } else {
      // Take a new snapshot to reminder where we were.
      this.snapshot();
    }
  }

});
