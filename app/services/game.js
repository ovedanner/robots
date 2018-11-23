import Service from '@ember/service';
import { assert } from '@ember/debug';

/**
 * The game service is responsible for handling
 * high level board events, such as when a goal
 * is reached by a user or the game is finished.
 */
export default Service.extend({
  /**
   * Holds all known boards and their progress.
   */
  plays: null,

  init(...args) {
    this._super(args);
    this.set('plays', {});
  },

  /**
   * Registers the given board at the game service.
   * @param board
   */
  registerBoard(board) {
    if (!this.plays[board]) {
      this.plays[board] = {
        remainingGoals: [],
        completedGoals: {},
        finished: false,
      };
    }
  },

  /**
   * Returns properties for the given board.
   * @param board
   * @returns {*}
   */
  getProperties(board) {
    const boardProperties = this.plays[board];

    assert('Board must be registered', !!boardProperties);

    return boardProperties;
  },

  /**
   * Returns whether or not the board is finished.
   * @param board
   * @returns {boolean}
   */
  isFinished(board) {
    const boardProperties = this.getProperties(board);

    return boardProperties.finished;
  },

  /**
   * Starts a new game on the given board.
   * @param board
   */
  startNewGame(board) {
    // Initialize the robots.
    board.initializeRobots();

    // Set a new goal.
    const newGoal = this.getNextGoal(board);

    if (newGoal) {
      board.setCurrentGoal(newGoal);
    }
  },

  /**
   * Indicates that the given goal was reached on the given board.
   * @param board
   * @param goal
   */
  goalReached(board, goal) {
    const boardProperties = this.getProperties(board);

    // Update remaining goals.
    boardProperties.remainingGoals.removeObject(goal);

    // Log all the moves for the completed goal.
    boardProperties.completedGoals[board.getGoalId(goal)] =
      JSON.parse(JSON.stringify(board.getCurrentMoves()));

    const newGoal = this.getNextGoal(board);

    // Are there any goals left?
    if (newGoal) {
      board.setCurrentGoal(newGoal);
    } else {
      this.finishGame(board);
    }
  },

  /**
   * Finishes a game on the given board.
   * @param board
   */
  finishGame(board) {
    const boardProperties = this.getProperties(board);

    boardProperties.finished = true;
    board.set('finished', true);
  },

  /**
   * Retrieves the next goal to solve for a given board.
   */
  getNextGoal(board) {
    const boardProperties = this.getProperties(board);
    const { goals } = board;
    const completed = Object.keys(boardProperties.completedGoals);

    const possibleGoals = goals.filter((goal) => {
      return !completed.includes(board.getGoalId(goal));
    });
    const index = Math.floor(Math.random() * possibleGoals.length);

    return (possibleGoals.length > 0 ? possibleGoals[index] : null);
  },
});
