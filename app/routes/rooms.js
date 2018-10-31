import Route from '@ember/routing/route';

/**
 * Rooms route. Starting point for multiplayer.
 */
export default Route.extend({
  model() {
    return this.store.findAll('room');
  }
});
