import SessionService from 'ember-simple-auth/services/session';
import { alias } from '@ember/object/computed';

export default SessionService.extend({
  token: alias('data.authenticated.data.attributes.token'),
  tokenId: alias('data.authenticated.data.id')
});
