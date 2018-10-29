import Controller from '@ember/controller';

/**
 * Signup controller.
 */
export default Controller.extend({
  actions: {
    signup(user) {
      user.save().then(() => {
        this.session.authenticate('authenticator:basic', user.email, user.password).then(() => {
          this.transitionToRoute('index')
        });
      });
    }
  },
});
