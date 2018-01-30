import Ember from 'ember';

/**
 * Represents a board layout, which comprises of
 * the walls of the cells and the goals.
 */
export default Ember.Object.extend({

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
  ]
});
