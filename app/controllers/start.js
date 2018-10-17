import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    login() {
      this.get('session').authenticate('authenticator:torii', 'google');
    }
  }
});
