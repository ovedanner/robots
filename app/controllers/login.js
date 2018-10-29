import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    login(email, password) {
      this.session.authenticate('authenticator:basic', email, password);
    },
  }
});
