import { inject as service } from '@ember/service';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import BaseAuthenticatorHandlers from '../mixins/base-authenticator-handlers';

export default ToriiAuthenticator.extend(BaseAuthenticatorHandlers, {
  torii: service(),
  ajax: service(),

  authenticate() {
    return this._super(...arguments).then((data) => {
      const credentials = {
        data: {
          code: data.authorizationCode
        }
      };

      return this.ajax.post('/access_tokens/google', credentials).then((data) => {
        return {
          token: data.data.attributes.token,
          tokenId: data.data.id,
          userId: data.data.relationships.user.data.id
        }
      });
    });
  },
});
