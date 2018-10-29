import DS from 'ember-data';

/**
 * User model.
 */
export default DS.Model.extend({
  firstname: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
  password_confirmation: DS.attr('string'),
});
