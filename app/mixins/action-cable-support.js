import Mixin from '@ember/object/mixin';
import ENV from 'robots/config/environment';
import { inject as service } from '@ember/service';

/**
 * Mixin that adds websocket support compatible with
 * ActionCable.
 */
export default Mixin.create({

  websockets: service(),
  session: service(),

  socket: null,
  socketOptions: null,
  channelIdentifier: null,

  /**
   * Socket setup.
   * @param options
   */
  setupSocket(options) {
    const socket = this.websockets.socketFor(`${ENV.websocketHost}?token=${this.session.token}`);

    // Register handlers.
    socket.on('open', options.open || this.defaultOpen, this);
    socket.on('message', options.message || this.defaultMessage, this);
    socket.on('close', options.close || this.defaultClose, this);

    this.setProperties({
      socket: socket,
      socketOptions: options
    })
  },

  /**
   * Subscribe to the given channel.
   * @param channelName
   * @param params
   */
  subscribeToChannel(channelName, params) {
    const identifier = JSON.stringify(Object.assign(params || {}, { channel: channelName }));
    const message = {
      command: 'subscribe',
      identifier: identifier,
    };

    this.socket.send(JSON.stringify(message));
    this.set('channelIdentifier', identifier);
  },

  /**
   * Performs the given action with the given data.
   * @param action
   * @param data
   */
  performAction(action, data) {
    const payload = Object.assign(data, { action: action });
    const message = {
      command: 'message',
      identifier: this.channelIdentifier,
      data: JSON.stringify(payload)
    };

    this.socket.send(JSON.stringify(message))
  },

  /**
   * Socket teardown.
   */
  teardownSocket() {
    const socket = this.socket;

    // Remove handlers.
    socket.off('open', this.socketOptions.open);
    socket.off('message', this.socketOptions.message);
    socket.off('close', this.socketOptions.close);
  },

  defaultOpen() {
    return true;
  },

  defaultMessage() {
    return true;
  },

  defaultClose() {
    return true;
  }
});
