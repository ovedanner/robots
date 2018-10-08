import EmberObject from '@ember/object';

/**
 * Board state.
 */
export default EmberObject.extend({

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
    });

    this.set('robots', robots);
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
      selectedRobot.position = {
        row: row,
        column: column,
      }
    }
  },
});
