import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | board', function(hooks) {
  setupTest(hooks);

  /**
   * Test basic board properties.
   */
  test('has proper basic properties', function(assert) {
    const cells = [
        [1, 4, 9],
        [15, 1, 1],
        [8, 12, 2],
      ],
      goals = [
        {
          color: 'red',
          number: 2,
        }
      ],
      board = this.owner.lookup('service:store').createRecord('board', {
        cells: cells,
        goals: goals,
      });

    assert.ok(board);
    assert.equal(board.nrRows, 3, 'Board has proper row numbers');
    assert.equal(board.nrColumns, 3, 'Board has proper column numbers');
  });

  /**
   * Test transposed (column) cells.
   */
  test('has proper transposed cells', function(assert) {
    const cells = [
        [1, 4, 12, 3],
        [12, 7, 1, 3],
        [2, 2, 2, 4],
        [10, 1, 1, 6],
      ],
      goals = [
        {
          color: 'red',
          number: 2,
        },
        {
          color: 'blue',
          number: 7,
        }
      ],
      board = this.owner.lookup('service:store').createRecord('board', {
        cells: cells,
        goals: goals,
      });

    assert.deepEqual(board.columnCells, [
      [1, 12, 2, 10],
      [4, 7, 2, 1],
      [12, 1, 2, 1],
      [3, 3, 4, 6],
    ], 'Board has proper transposed cells');
  })
});
