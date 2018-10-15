import Component from '@ember/component';

/**
 * Control panel for the board.
 */
const BoardControls = Component.extend({
  classNames: ['board-controls', 'p-4'],

  /**
   * The board object.
   */
  board: null,

  actions: {
    restoreBoard() {
    },

    startNewGame() {
      this.board.startNewGame();
    }
  }
});

BoardControls.reopenClass({
  positionalParams: ['board']
});

export default BoardControls;
