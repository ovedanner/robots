import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    saveRoom(room) {
      room.save().then(() => {
        this.transitionToRoute('rooms');
      });
    },

    closeModal(modal) {
      modal.close();
      this.transitionToRoute('rooms');
    }
  }
});
