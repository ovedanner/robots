import Component from '@ember/component';
import { inject as service } from '@ember/service';

/**
 * Control panel for the board.
 */
const BoardControls = Component.extend({
  classNames: ['board-controls', 'p-4', 'blue-borders'],

  /**
   * Game service.
   */
  game: service(),

  /**
   * The board object.
   */
  board: null,

  actions: {
    resetRobotsToStart() {
      this.board.resetRobotsToStart();
    },

    startNewGame() {
      this.game.startNewGame(this.board);
    },
  }
});

BoardControls.reopenClass({
  positionalParams: ['board']
});

export default BoardControls;
