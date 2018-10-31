import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  authenticate(email, password) {
    const credentials = {
      data: {
        email: email,
        password: password,
      },
    };

    return this.ajax.post('/access_tokens', credentials).then((data) => {
      return {
        token: data.data.attributes.token,
        tokenId: data.data.id,
        userId: data.data.relationships.user.data.id
      }
    });
  },

  invalidate(data) {
    return this.ajax.del(`access_tokens/${data.tokenId}`)
  },

  restore(data) {
    return new Promise(function(resolve) {
      resolve(data);
    });
  },
});
