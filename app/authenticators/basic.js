import Base from 'ember-simple-auth/authenticators/base';
import BaseAuthenticatorHandlers from '../mixins/base-authenticator-handlers';

export default Base.extend(BaseAuthenticatorHandlers, {
  authenticate(email, password) {
    const credentials = {
      data: {
        email,
        password,
      },
    };

    return this.ajax.post('/access_tokens', credentials).then((data) => {
      return {
        token: data.data.attributes.token,
        tokenId: data.data.id,
        userId: data.data.relationships.user.data.id,
      };
    });
  },
});
