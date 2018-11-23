import { underscore } from '@ember/string';
import DS from 'ember-data';

/**
 * Default serializer converts hyphens to underscores. We don't want
 * that.
 */
export default DS.JSONAPISerializer.extend({
  keyForAttribute(attr) {
    return underscore(attr);
  },
});
