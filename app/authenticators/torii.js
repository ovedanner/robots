import { inject as service } from '@ember/service';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';

export default ToriiAuthenticator.extend({
  torii: service(),
  ajax: service(),

  authenticate() {
    return this._super(...arguments).then((data) => {
      const credentials = {
        data: {
          code: data.authorizationCode
        }
      };

      return this.ajax.post('/access_tokens/google', credentials)
    });
  },

  invalidate(data) {
    return this.ajax.del(`access_tokens/${data.data.id}`)
  },

  restore(data) {
    return new Promise(function(resolve) {
      resolve(data);
    });
  },
});
