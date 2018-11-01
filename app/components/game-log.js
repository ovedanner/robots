import Component from '@ember/component';
import { inject as service } from '@ember/service';
import ActionCableSupport from '../mixins/action-cable-support';

/**
 * Log component for all game related events. This includes
 * the chatting.
 */
export default Component.extend(ActionCableSupport, {
  classNames: ['d-flex game-log', 'p-4', 'blue-borders'],
  game: service(),
  room: null,

  /**
   * Holds all events that will be displayed, such as chat messages
   * or board moves.
   */
  events: null,

  actions: {
    /**
     * Sends a text message to everyone in the room channel.
     * @param message
     */
    sendMessage(message) {
      this.performAction('speak', { message: message });
    }
  },

  /**
   * Initialize events array and setup socket stuff.
   */
  didInsertElement() {
    this._super(...arguments);

    this.set('events', []);

    this.setupSocket({
      open: this.socketOpen,
      message: this.socketMessage,
      close: this.socketClose
    });
  },

  /**
   * Make sure to properly clean up socket stuff.
   */
  willDestroyElement() {
    this._super(...arguments);

    this.teardownSocket();
  },

  /**
   * Subscribe to the chat channel.
   */
  socketOpen() {
    this.subscribeToChannel('ChatChannel', {
      room: this.room.id
    });
  },

  /**
   * Called whenever a message is received.
   * @param event
   */
  socketMessage(event) {
    const data = JSON.parse(event.data);

    if (data.message && data.message.action === 'speak') {
      this.events.pushObject({
        message: data.message.message
      });
    }
  },
});
