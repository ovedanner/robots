import Ember from 'ember';

/**
 * Represents a board layout, which comprises of
 * the walls of the cells and the goals.
 */
export default Ember.Object.extend({

  /**
   * Walls of the board.
   */
  walls: [
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
      type: 'star',
      color: 'red',
      number: 19
    },
    {
      type: 'gears',
      color: 'red',
      number: 31
    },
    {
      type: 'moon',
      color: 'red',
      number: 178
    },
    {
      type: 'planet',
      color: 'red',
      number: 190
    },
    {
      type: 'star',
      color: 'blue',
      number: 44
    },
    {
      type: 'gears',
      color: 'blue',
      number: 203
    },
    {
      type: 'moon',
      color: 'blue',
      number: 102
    },
    {
      type: 'planet',
      color: 'blue',
      number: 199
    },
    {
      type: 'star',
      color: 'green',
      number: 172
    },
    {
      type: 'gears',
      color: 'green',
      number: 227
    },
    {
      type: 'moon',
      color: 'green',
      number: 110
    },
    {
      type: 'planet',
      color: 'green',
      number: 50
    },
    {
      type: 'star',
      color: 'yellow',
      number: 148
    },
    {
      type: 'gears',
      color: 'yellow',
      number: 71
    },
    {
      type: 'moon',
      color: 'yellow',
      number: 221
    },
    {
      type: 'planet',
      color: 'yellow',
      number: 123
    }
  ]
});
