import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    logout() {
      this.session.invalidate();
    },
  },
});
