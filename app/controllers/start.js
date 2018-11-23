import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    loginWithGoogle() {
      this.session.authenticate('authenticator:torii', 'google');
    },

    logout() {
      this.session.invalidate();
    },
  },
});
