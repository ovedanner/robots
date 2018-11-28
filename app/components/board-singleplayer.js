import Component from '@ember/component';

/**
 * Singleplayer board component.
 */
export default Component.extend({
  classNames: ['d-flex'],

  board: null,

  completedGoals: null,

  actions: {
    /**
     * Start a new game.
     */
    startNewGame() {
      this.performAction('start_new_game');
    },

    /**
     * Resets board moves.
     */
    resetMoves() {
      this.board.resetRobotsToStart();
    },

    /**
     * Called when a certain row and column on the board have been clicked.
     * @param row
     * @param column
     */
    clickedBoard(row, column) {
      const reachedCurrentGoal = this.board.click(row, column);

      // If the current goal has been reached
      if (reachedCurrentGoal) {
        const goal = this.board.currentGoal;
        const nextGoal = this.getNextGoal();

        if (nextGoal) {
          this.completedGoals.pushObject(this.board.getGoalId(goal));
          this.board.setCurrentGoal(nextGoal);
        }
      }
    },

    boardSizeCalculated(width, height) {
      document.getElementById('game-controls').style.height = `${height}px`;
    },
  },

  /**
   * Start the game as soon as the element is rendered.
   * @param args
   */
  didInsertElement(...args) {
    this._super(args);

    this.set('completedGoals', []);
    this.board.initializeRobots();
    this.board.setCurrentGoal(this.getNextGoal());
  },

  /**
   * Retrieves the next goal to solve for the board.
   */
  getNextGoal() {
    const { board } = this;
    const possibleGoals = board.goals.filter((goal) => {
      return !this.completedGoals.includes(board.getGoalId(goal));
    });
    const index = Math.floor(Math.random() * possibleGoals.length);

    return (possibleGoals.length > 0 ? possibleGoals[index] : null);
  },
});
