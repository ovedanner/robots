import Ember from 'ember';
import Cell from 'ricochet-robots/models/cell';
import Goal from 'ricochet-robots/models/goal';
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
   * The current goal to work towards.
   */
  currentGoal: null,

  /**
   * The fake cell in the middle that holds the current
   * goal.
   */
  cellForCurrentGoal: null,

  /**
   * The current number of moves to get towards the current goal.
   */
  currentNrOfMoves: 0,

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
      margin = Math.floor((fullWidth - fullHeight) / 2);
      cellSize = Math.floor((fullHeight - (fullHeight % 16)) / 16);
    } else {
      landscape = false;
      margin = Math.floor((fullHeight - fullWidth) / 2);
      cellSize = Math.floor((fullWidth - (fullWidth % 16)) / 16);
    }

    // Load the board layout.
    let layout = BoardLayout.create(),
      walls = layout.get('walls'),
      rawGoals = layout.get('goals');

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

    // Create the display goal cell.
    this.set('cellForCurrentGoal', Cell.create({
      x: Math.floor(cells[0].get('x') + (cellSize * 7.5)),
      y: Math.floor(cells[0].get('y') + (cellSize * 7.5)),
      borders: false,
      size: cellSize,
      context: context
    }));

    // Create the goals.
    for (let i = 0; i < rawGoals.get('length'); i++) {
      let goalProperties = rawGoals[i],
        goalCell = cells[goalProperties.number - 1],
        goal = Goal.create({
          context: context,
          type: goalProperties.type,
          color: goalProperties.color,
          solved: false
        });
      goalCell.set('goal', goal);
    }

    // Set the cells on the board.
    this.set('cells', cells);

    // Randomly initialize the robots.
    this.initializeRobots();

    // Start with a goal.
    this.setNewGoal();
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
    let selectedRobot = this.get('robots').find((robot) => {
      let radius = robot.get('radius'),
        xCenter = robot.get('x'),
        yCenter = robot.get('y');

      return Math.sqrt(Math.pow((x - xCenter), 2) + Math.pow((y - yCenter), 2)) < radius;
    }), currentGoal = this.get('cellForCurrentGoal.goal');

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
            this.set('currentNrOfMoves', 0);
            this.setNewGoal();
          }
        }
      }
    }
  },

  /**
   * Draws the board and everything on it.
   */
  draw() {
    let context = this.get('context'),
      cells = this.get('cells'),
      cellForCurrentGoal = this.get('cellForCurrentGoal'),
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

    // Draw the cell that holds the current goal.
    cellForCurrentGoal.draw();

    // Now draw the robots.
    robots.forEach((robot) => {
      robot.draw();
    });
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
   * Sets a new goal from the remaining goals.
   */
  setNewGoal() {
    let remainingCellsWithGoals = this.get('cells').filter((cell) => {
      return cell.get('goal') && !cell.get('goal.reached');
    });
    let index = Math.floor((Math.random() * remainingCellsWithGoals.get('length')) + 1),
      newGoal = remainingCellsWithGoals[index].get('goal');

    let cellForCurrentGoal = this.get('cellForCurrentGoal');
    cellForCurrentGoal.set('goal', newGoal);
  }

});
