import Service from '@ember/service';
import { assert } from '@ember/debug';

export default Service.extend({

  plays: null,

  init() {
    this._super(...arguments);
    this.set('plays', {});
  },

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

    return boardProperties
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

  goalReached(board, goal) {
    const boardProperties = this.getProperties(board);

    // Update remaining goals.
    boardProperties.remainingGoals.removeObject(goal);

    // Log all the moves for the completed goal.
    boardProperties.completedGoals[board.getGoalId(goal)] = JSON.parse(JSON.stringify(board.getCurrentMoves()));

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
    const boardProperties = this.getProperties(board),
      goals = board.goals,
      completed = Object.keys(boardProperties.completedGoals);

    const possibleGoals = goals.filter((goal) => {
        return !completed.includes(board.getGoalId(goal));
      }),
      index = Math.floor(Math.random() * possibleGoals.length);

    return (possibleGoals.length > 0 ? possibleGoals[index] : null);
  },
});
