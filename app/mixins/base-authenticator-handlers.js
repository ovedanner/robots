import Mixin from '@ember/object/mixin';
import { isUnauthorizedError } from 'ember-ajax/errors';

/**
 * Provides default authentication handlers for authenticators.
 */
export default Mixin.create({
  invalidate(data) {
    return this.ajax.del(`access_tokens/${data.tokenId}`).catch((error) => {
      if (isUnauthorizedError(error)) {
        return;
      }

      throw error;
    });
  },

  restore(data) {
    return new Promise(function(resolve) {
      resolve(data);
    });
  },
});
