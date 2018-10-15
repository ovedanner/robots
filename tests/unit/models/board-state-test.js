import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | board state', function(hooks) {
  setupTest(hooks);

  test('retrieve next goal success', function(assert) {
    const store = this.owner.lookup('service:store'),
      board = store.createRecord('board', {
        cells: [
          [],
          [],
          [],
        ]
    });
    assert.ok(model);
  });
});
