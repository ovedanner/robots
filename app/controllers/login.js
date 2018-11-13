import Controller from '@ember/controller';
import { isUnauthorizedError } from 'ember-ajax/errors';

export default Controller.extend({
  actions: {
    login(email, password) {
      this.set('errorMessage', null);

      this.session.authenticate('authenticator:basic', email, password).catch((error) => {
        if (isUnauthorizedError(error)) {
          this.set('errorMessage', 'Unknown email and/or password.');
        } else {
          this.set('errorMessage', 'Unknown error occurred, please try again later.');
        }
      });
    },
  }
});
