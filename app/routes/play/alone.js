import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

/**
 * Route for playing a game.
 */
export default Route.extend({
  /**
   * Game service.
   */
  gameService: service('game'),

  /**
   * Fetch a board to play.
   */
  model() {
    return this.store.createRecord('board', {
      cells: [
        [9, 1, 1, 1, 3],
        [8, 0, 0, 0, 2],
        [8, 0, 0, 0, 2],
        [8, 0, 0, 0, 2],
        [12, 4, 4, 4, 6],
      ],
      goals: [
        {
          color: 'red',
          number: 24,
        },
        {
          color: 'blue',
          number: 2,
        },
      ],
      robotColors: ['red', 'blue', 'green'],
    });
  },

  /**
   * Register the board.
   * @param model
   */
  afterModel(model) {
    this.gameService.registerBoard(model);
    this.gameService.startNewGame(model);
  },
});
