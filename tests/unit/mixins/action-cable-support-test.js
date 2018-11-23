import EmberObject from '@ember/object';
import ActionCableSupportMixin from 'robots/mixins/action-cable-support';
import { module, test } from 'qunit';

module('Unit | Mixin | action-cable-support', () => {
  // Replace this with your real tests.
  test('it works', (assert) => {
    const ActionCableSupportObject = EmberObject.extend(ActionCableSupportMixin);
    const subject = ActionCableSupportObject.create();
    assert.ok(subject);
  });
});
