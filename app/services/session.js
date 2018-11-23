import SessionService from 'ember-simple-auth/services/session';
import { alias } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default SessionService.extend({
  store: service(),

  token: alias('data.authenticated.token'),
  tokenId: alias('data.authenticated.tokenId'),
  user: computed('data.authenticated.userId', function() {
    const { userId } = this.data.authenticated;

    if (userId) {
      return this.store.findRecord('user', userId);
    }

    return null;
  }),
});
