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
        [9, 1, 1, 1, 3, 9, 1, 1, 1, 3, 9, 1, 1, 1, 5, 3],
        [8, 0, 6, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 9, 2],
        [8, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 12, 0, 0, 0, 2],
        [10, 12, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 6],
        [12, 1, 0, 0, 0, 2, 9, 0, 0, 0, 0, 0, 0, 0, 0, 3],
        [9, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [8, 0, 0, 0, 0, 3, 8, 4, 4, 0, 4, 0, 0, 6, 8, 2],
        [8, 0, 0, 6, 8, 0, 2, 15, 15, 8, 3, 8, 0, 1, 0, 2],
        [8, 0, 0, 5, 0, 0, 2, 15, 15, 8, 0, 0, 0, 0, 0, 2],
        [8, 0, 0, 3, 8, 0, 0, 1, 1, 0, 0, 4, 0, 0, 0, 2],
        [8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 9, 0, 0, 0, 2],
        [10, 12, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 12, 0, 6],
        [8, 1, 0, 0, 0, 0, 6, 8, 0, 0, 3, 8, 0, 1, 0, 3],
        [12, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 6, 8, 0, 2],
        [9, 2, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 2],
        [12, 4, 4, 4, 4, 6, 12, 4, 4, 6, 12, 4, 4, 4, 4, 6],
      ],
      goals: [
        {
          color: 'red',
          number: 18
        },
        {
          color: 'red',
          number: 30
        },
        {
          color: 'red',
          number: 177
        },
        {
          color: 'red',
          number: 189
        },
        {
          color: 'blue',
          number: 43
        },
        {
          color: 'blue',
          number: 202
        },
        {
          color: 'blue',
          number: 101
        },
        {
          color: 'blue',
          number: 198
        },
        {
          color: 'green',
          number: 171
        },
        {
          color: 'green',
          number: 226
        },
        {
          color: 'green',
          number: 109
        },
        {
          color: 'green',
          number: 49
        },
        {
          color: 'yellow',
          number: 147
        },
        {
          color: 'yellow',
          number: 70
        },
        {
          color: 'yellow',
          number: 220
        },
        {
          color: 'yellow',
          number: 122
        }
      ],
      robotColors: [
        'red',
        'blue',
        'green',
        'yellow',
        'silver',
      ]
    });
    // return this.store.createRecord('board', {
    //   cells: [
    //     [9, 1, 1, 1, 3],
    //     [8, 0, 0, 0, 2],
    //     [8, 0, 0, 0, 2],
    //     [8, 0, 0, 0, 2],
    //     [12, 4, 4, 4, 6],
    //   ],
    //   goals: [
    //     {
    //       color: 'red',
    //       number: 24,
    //     },
    //     {
    //       color: 'blue',
    //       number: 2,
    //     }
    //   ],
    //   robotColors: ['red', 'blue', 'green'],
    // });
  },

  /**
   * Start a game on the board.
   * @param model
   */
  afterModel(model) {
    this.gameService.registerBoard(model);
    this.gameService.startNewGame(model);
  }
});
