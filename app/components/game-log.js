import Component from '@ember/component';
import { inject as service } from '@ember/service';
import ActionCableSupport from '../mixins/action-cable-support';
import { next } from '@ember/runloop';

/**
 * Log component for all game related events. This includes
 * the chatting.
 */
export default Component.extend(ActionCableSupport, {
  classNames: ['d-flex game-log', 'blue-borders', 'flex-grow-0', 'flex-column'],
  gameLog: service(),
  room: null,
  newMessage: '',

  actions: {
    /**
     * Sends a text message to everyone in the room channel.
     * @param message
     */
    sendMessage(message) {
      this.performAction('speak', { message: message });
      this.set('newMessage', '');
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
      this.gameLog.addEvent(data.message);

      this.scrollEvenListToBottom();
    }
  },

  /**
   * Scroll the even list to the bottom.
   */
  scrollEvenListToBottom() {
    next(() => {
      const el = document.getElementById('game-log-container');
      el.scrollTop = el.scrollHeight - el.clientHeight;
    });
  }
});
