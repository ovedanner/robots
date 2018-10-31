import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    saveRoom(room) {
      room.save();
    },

    joinRoom(room) {
      room.get('members').forEach((member) => {
        console.log(member.email);
      })
      // this.ajax.post(`/rooms/${room.id}/join`).then(() => {
      //   this.transitionToRoute('play.room', room);
      // });
    },
  },
});
