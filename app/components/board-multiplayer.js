import Component from '@ember/component';
import ActionCableSupport from '../mixins/action-cable-support';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend(ActionCableSupport, {

  store: service(),

  classNames: ['d-flex'],

  /**
   * The board will be loaded through a websocket when
   * the owner starts a game.
   */
  board: null,

  /**
   * Does the user own the room? If so, he has more controls.
   */
  userOwnsRoom: computed('user.id', 'room.owner.id', function() {
    return this.user.get('id') === this.room.owner.get('id');
  }),

  actions: {
    /**
     * Start a new game.
     */
    start() {
      this.performAction('start');
    }
  },

  /**
   * Initialize events array and setup socket stuff.
   */
  didInsertElement() {
    this._super(...arguments);

    this.setupSocket({
      open: this.socketOpen,
      message: this.socketMessage,
    });
  },

  /**
   * Subscribe to the game channel.
   */
  socketOpen() {
    this.subscribeToChannel('GameChannel', {
      room: this.room.id
    });
  },

  /**
   * Called whenever a message is received.
   * @param event
   */
  socketMessage(event) {
    const data = JSON.parse(event.data);

    // Starts a new game, board data is received.
    if (data.message && data.message.action === 'start') {
      const boardData = data.message;
      const board = this.store.createRecord('board', {
        cells: boardData.cells,
        goals: boardData.goals,
        robotColors: boardData.robot_colors
      });
      board.setRobotPositions(boardData.robot_positions);
      board.setCurrentGoal(boardData.current_goal);

      this.set('board', board);
    }
  },
});
