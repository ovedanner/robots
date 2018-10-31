import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('start');
  this.route('play', function() {
    this.route('room', { path: ':id' });
    this.route('alone');
  });
  this.route('login');
  this.route('signup');

  this.route('rooms', function() {
    this.route('add');
  });
});

export default Router;
