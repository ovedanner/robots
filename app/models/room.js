import DS from 'ember-data';

/**
 * Room model.
 */
export default DS.Model.extend({
  name: DS.attr('string'),
  owner: DS.belongsTo('user'),
  open: DS.attr('boolean'),
  members: DS.hasMany('user', { async: true }),
});
