import EmberObject from '@ember/object';
import ActionCableSupportMixin from 'robots/mixins/action-cable-support';
import { module, test } from 'qunit';

module('Unit | Mixin | action-cable-support', function() {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let ActionCableSupportObject = EmberObject.extend(ActionCableSupportMixin);
    let subject = ActionCableSupportObject.create();
    assert.ok(subject);
  });
});
