import Component from '@ember/component';

export default Component.extend({
  attributeBindings: ['id'],
  id: 'game-controls',
  classNames: ['d-flex', 'flex-column', 'gray-borders', 'mr-2'],
});
