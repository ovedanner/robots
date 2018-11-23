import { inject as service } from '@ember/service';
import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import BaseAuthenticatorHandlers from '../mixins/base-authenticator-handlers';

export default ToriiAuthenticator.extend(BaseAuthenticatorHandlers, {
  torii: service(),
  ajax: service(),

  authenticate(...args) {
    return this._super(args).then((data) => {
      const credentials = {
        data: {
          code: data.authorizationCode,
        },
      };

      return this.ajax.post('/access_tokens/google', credentials).then((result) => {
        return {
          token: result.data.attributes.token,
          tokenId: result.data.id,
          userId: result.data.relationships.user.data.id,
        };
      });
    });
  },
});
