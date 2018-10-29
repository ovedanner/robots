import AjaxService from 'ember-ajax/services/ajax';
import ENV from 'robots/config/environment';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default AjaxService.extend({
  host: ENV.backendHost,
  namespace: 'api',
  session: service(),

  headers: computed('session.token', {
    get() {
      let headers = {};

      const authToken = this.session.token;
      if (authToken) {
        headers['Authorization'] = `Token token="${authToken}"`;
      }
      return headers;
    }
  })
})
