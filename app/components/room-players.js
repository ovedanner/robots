import Component from '@ember/component';

export default Component.extend({
  tagName: 'ul',
  classNames: ['d-flex', 'flex-column', 'gray-borders', 'mr-2'],
  attributeBindings: ['id'],
  id: 'player-log',
});
