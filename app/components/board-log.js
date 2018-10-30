import Component from '@ember/component';
import { inject as service } from '@ember/service';

/**
 * Log
 */
const BoardLog = Component.extend({
  classNames: ['board-log', 'p-4', 'blue-borders'],

  /**
   * Game service.
   */
  gameService: service('game'),

  /**
   * The board object.
   */
  board: null,
});

BoardLog.reopenClass({
  positionalParams: ['board']
});

export default BoardLog;
