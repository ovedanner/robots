import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'li',
  classNames: 'game-event d-flex flex-column p-2 mb-2',
  classNameBindings: ['ownMessage:own:other'],

  ownMessage: computed('event.author_id', 'user.id', function() {
    return this.event.author_id === this.user.get('id');
  })
});
