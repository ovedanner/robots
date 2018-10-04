import Component from '@ember/component';

/**
 * Control panel for the board.
 */
const BoardControls = Component.extend({
  classNames: ['board-controls'],

  /**
   * The board object.
   */
  board: null,

  actions: {
    restoreBoard() {
      this.get('board').restore();
    }
  }
});

BoardControls.reopenClass({
  positionalParams: ['board']
});

export default BoardControls;
