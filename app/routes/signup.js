import Route from '@ember/routing/route';

/**
 * Simple signup route.
 */
export default Route.extend({

  model() {
    return this.store.createRecord('user');
  }
});
