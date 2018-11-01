import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    saveRoom(room) {
      room.save();
    },

    /**
     * Join the given room (if you're not a member yet).
     * @param room
     */
    joinRoom(room) {
      this.ajax.post(`/rooms/${room.id}/join`).then(() => {
        this.transitionToRoute('play.room', room);
      });
    },
  },
});
