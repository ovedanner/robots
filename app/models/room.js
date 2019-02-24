import DS from 'ember-data';
import { computed } from '@ember/object';

/**
 * Room model.
 */
export default DS.Model.extend({
  name: DS.attr('string'),
  owner: DS.belongsTo('user'),
  open: DS.attr('boolean', { defaultValue: true }),
  members: DS.hasMany('user'),
  readyMembers: computed('members.@each.ready', function() {
    return this.members.filter((member) => {
      return member.ready;
    });
  }),
});
