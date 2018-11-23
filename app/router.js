import EmberRouter from '@ember/routing/router';
import config from 'robots/config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL,
});

/* eslint-disable array-callback-return */
Router.map(function() {
  this.route('start');
  this.route('play', function() {
    this.route('room', { path: ':id' });
    this.route('alone');
  });
  this.route('rooms', function() {
    this.route('add');
  });
});
/* eslint-enable array-callback-return */

export default Router;
