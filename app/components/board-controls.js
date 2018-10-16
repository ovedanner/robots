import Component from '@ember/component';
import { inject as service } from '@ember/service';

/**
 * Control panel for the board.
 */
const BoardControls = Component.extend({
  classNames: ['board-controls', 'p-4'],

  /**
   * Game service.
   */
  gameService: service('game'),

  /**
   * The board object.
   */
  board: null,

  actions: {
    resetRobotsToStart() {
      this.board.resetRobotsToStart();
    },
  }
});

BoardControls.reopenClass({
  positionalParams: ['board']
});

export default BoardControls;
