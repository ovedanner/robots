import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    saveRoom(room) {
      room.save();
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
