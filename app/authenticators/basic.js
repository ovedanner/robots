import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({
  authenticate(email, password) {
    const credentials = {
      data: {
        email: email,
        password: password,
      },
    };

    return this.ajax.post('/access_tokens', credentials);
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
