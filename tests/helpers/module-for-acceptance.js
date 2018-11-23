import { Promise } from 'rsvp';
import { module } from 'qunit';
import startApp from './start-app';
import destroyApp from './destroy-app';

/* eslint-disable */
export default function(name, options = {}) {
  module(name, {
    beforeEach() {
      this.application = startApp();

      if (options.beforeEach) {
        return options.beforeEach.apply(this, arguments);
      }
    },

    afterEach() {
      let afterEach = options.afterEach && options.afterEach.apply(this, arguments);
      return Promise.resolve(afterEach).then(() => destroyApp(this.application));
    }
  });
}
/* eslint-enable */
