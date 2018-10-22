import DS from 'ember-data';

export default DS.Model.extend({
  firstname: DS.attr('string'),
  email: DS.attr('string'),
});
