import Route from '@ember/routing/route';

export default Route.extend({
  showModal: true,

  model() {
    return this.store.createRecord('room', {
      owner: this.session.user
    })
  },

  deactivate() {
    const room = this.modelFor(this.routeName);
    if (room.get('hasDirtyAttributes')) {
      room.destroyRecord();
    }

    this._super(...arguments);
  }
});
