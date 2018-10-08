import Route from '@ember/routing/route';

/**
 * Route for playing a game.
 */
export default Route.extend({
  /**
   * Fetch a board to play.
   */
  model() {
    return this.store.createRecord('board', {
      cells: [
        [0, 0, 0, 0, 2, 8, 0, 0, 0, 2, 8, 0, 0, 0, 4, 0],
        [0, 0, 6, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 9, 0 ],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 12, 0, 0, 0, 0],
        [2, 12, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 4],
        [4, 1, 0, 0, 0, 2, 9, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 3, 8, 4, 4, 0, 4, 0, 0, 6, 8, 0],
        [0, 0, 0, 6, 8, 0, 2, 15, 15, 8, 3, 8, 0, 1, 0, 0],
        [0, 0, 0, 5, 0, 0, 2, 15, 15, 8, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 3, 8, 0, 0, 1, 1, 0, 0, 4, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 9, 0, 0, 0, 0],
        [2, 12, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 2, 12, 0, 4],
        [0, 1, 0, 0, 0, 0, 6, 8, 0, 0, 3, 8, 0, 1, 0, 1],
        [4, 0, 4, 0, 0, 0, 1, 0, 0, 0, 0, 0, 6, 8, 0, 0],
        [1, 2, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 2, 8, 0, 0, 2, 8, 0, 0, 0, 0, 0],
      ],
      goals: [
        {
          color: 'red',
          number: 19
        },
        {
          color: 'red',
          number: 31
        },
        {
          color: 'red',
          number: 178
        },
        {
          color: 'red',
          number: 190
        },
        {
          color: 'blue',
          number: 44
        },
        {
          color: 'blue',
          number: 203
        },
        {
          color: 'blue',
          number: 102
        },
        {
          color: 'blue',
          number: 199
        },
        {
          color: 'green',
          number: 172
        },
        {
          color: 'green',
          number: 227
        },
        {
          color: 'green',
          number: 110
        },
        {
          color: 'green',
          number: 50
        },
        {
          color: 'yellow',
          number: 148
        },
        {
          color: 'yellow',
          number: 71
        },
        {
          color: 'yellow',
          number: 221
        },
        {
          color: 'yellow',
          number: 123
        }
      ]
    });
  }
});
