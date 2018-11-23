import Component from '@ember/component';

export default Component.extend({
  classNames: ['d-flex'],

  board: null,

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
      }
    },

    boardSizeCalculated(width, height) {
      document.getElementById('game-controls').style.height = `${height}px`;
    },
  },
});
