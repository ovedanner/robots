import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  flashMessages: service(),

  actions: {
    saveRoom(room) {
      room.save();
    },

    deleteRoom(room) {
      room.deleteRecord();
      room.save().then(() => {
        this.flashMessages.success('Successfully deleted room.');
      });
    },

    /**
     * Joins the room by transitioning to the appropriate route.
     * That route's model will take care of the actual join call.
     * @param room
     */
    joinRoom(room) {
      this.ajax.post(`/rooms/${room.id}/join`).then(() => {
        this.transitionToRoute('play.room', room);
      });
    },
  },
});
