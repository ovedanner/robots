import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | play/room', (hooks) => {
  setupTest(hooks);

  test('it exists', function(assert) {
    const route = this.owner.lookup('route:play/room');
    assert.ok(route);
  });
});
