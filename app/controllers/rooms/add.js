import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    saveRoom(room) {
      room.save().then(() => {
        this.transitionToRoute('play.room', room);
      });
    },

    closeModal(modal) {
      modal.close();
      this.transitionToRoute('rooms');
    }
  }
});
