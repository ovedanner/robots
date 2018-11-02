import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'li',
  classNames: 'game-event d-flex p-2 mb-2 flex-shrink-0',
  classNameBindings: ['ownMessage:own:other'],

  ownMessage: computed('event.author_id', 'user.id', function() {
    return this.event.author_id === parseInt(this.user.get('id'));
  })
});
