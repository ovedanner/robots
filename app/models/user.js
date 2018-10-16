import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  email: DS.attr('string'),

  fullName: computed('firstName', 'lastName', function() {
    return `${this.firstName} ${this.lastName}`;
  })
});
