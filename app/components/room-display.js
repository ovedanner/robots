import Component from '@ember/component';
import { computed } from '@ember/object';

/**
 * Displays a room in the list.
 */
export default Component.extend({
  classNames: ['d-flex', 'flex-grow-1', 'p-1'],

  userOwnsRoom: computed('room.owner', 'user', function() {
    const ownerId = this.room.owner.get('id');
    const userId = this.user.get('id');

    return ownerId === userId || this.room.open;
  }),

  /**
   * A user can join a room if he is the owner or otherwise if
   * the room is open.
   */
  userCanJoinRoom: computed('room.open', 'userOwnsRoom', function() {
    return this.userOwnsRoom || this.room.open;
  }),
});
