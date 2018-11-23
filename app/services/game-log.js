import Service from '@ember/service';

export default Service.extend({
  /**
   * Holds all events that will be displayed, such as chat messages
   * or board moves.
   */
  events: null,

  init(...args) {
    this._super(args);
    this.set('events', []);
  },

  addEvent(event) {
    this.events.pushObject(event);
  },
});
