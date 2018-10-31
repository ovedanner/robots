import Component from '@ember/component';
import { computed } from '@ember/object';

/**
 * Displays a room in the list.
 */
export default Component.extend({
  /**
   * A user can join a room if he is the owner or otherwise if
   * the room is open.
   */
  userCanJoinRoom: computed('room.{owner,open}', 'user', function() {
    const ownerId = this.room.owner.get('id'),
      userId = this.user.id;

    return ownerId === userId || this.room.open;
  })
});
