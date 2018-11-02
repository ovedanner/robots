import Service from '@ember/service';

export default Service.extend({
  /**
   * Holds all events that will be displayed, such as chat messages
   * or board moves.
   */
  events: null,

  init() {
    this._super(...arguments);
    this.set('events', []);
  },

  addEvent(event) {
    this.events.pushObject(event);
  }
});
