import DS from 'ember-data';
import ENV from 'robots/config/environment';
import { inject as service } from '@ember/service';

export default DS.JSONAPIAdapter.extend({
  host: ENV.backendHost,
  namespace: 'api',
  session: service(),

  authorize(xhr) {
    const token = this.session.token;

    if (token) {
      const authData = `Token token="${token}"`;
      xhr.setRequestHeader('Authorization', authData);
    }
  }
});
