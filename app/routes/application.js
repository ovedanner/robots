import Route from '@ember/routing/route';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
import { isUnauthorizedError } from 'ember-ajax/errors';

export default Route.extend(ApplicationRouteMixin, {
  actions: {
    error(error) {
      if (isUnauthorizedError(error)) {
        this.session.invalidate();
      }
    }
  },

  /**
   * Load the user if we're authenticated.
   * @returns {number | user | Function}
   */
  beforeModel() {
    if (this.session.isAuthenticated) {
      return this.session.user;
    }
  },
});
