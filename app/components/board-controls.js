import Ember from 'ember';

/**
 * Control panel for the board.
 */
const BoardControls = Ember.Component.extend({
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
