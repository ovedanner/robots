import Route from '@ember/routing/route';
import { isNotFoundError } from 'ember-ajax/errors';
import { inject as service } from '@ember/service';

/**
 * Route to play in a specific room.
 */
export default Route.extend({
  flashMessages: service(),

  model(params) {
    return this.store.findRecord('room', params.id).catch((error) => {
      if (isNotFoundError(error)) {
        this.flashMessages.danger('Could not find the room you were looking for.');
        this.transitionTo('rooms');
      }
    });
  },

  afterModel(model) {
    return this.ajax.post(`/rooms/${model.id}/join`);
  },
});
