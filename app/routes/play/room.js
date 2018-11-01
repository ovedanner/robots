import Route from '@ember/routing/route';

/**
 * Route to play in a specific room.
 */
export default Route.extend({
  model(params) {
    return this.store.findRecord('room', params.id);
  }
});
