import Component from '@ember/component';
import ActionCableSupport from '../mixins/action-cable-support';
import { computed, observer } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend(ActionCableSupport, {
  gameLog: service(),
  store: service(),

  classNames: ['d-flex'],

  /**
   * The board will be loaded through a websocket when
   * the owner starts a game.
   */
  board: null,

  /**
   * Can the user provide a solution for the current goal?
   */
  cantProvideSolution: false,

  /**
   * Can the user provide moves?
   */
  canProvideMoves: false,

  /**
   * Does the user own the room? If so, he has more controls.
   */
  userOwnsRoom: computed('user.id', 'room.owner.id', function() {
    return this.user.get('id') === this.room.owner.get('id');
  }),

  /**
   * Observe the board for reaching the current goal. We might want to
   * send the moves.
   */
  isCurrentGoalReached: observer('board.currentGoalReached', function() {
    if (this.board.currentGoalReached) {
      this.performAction('solution_moves', {
        moves: this.board.moves
      });
    }
  }),

  actions: {
    /**
     * Start a new game.
     */
    start() {
      this.performAction('start');
    },

    /**
     * Claim to have a solution in the given number of moves.
     * @param nrMoves
     */
    sendNumberOfMoves(nrMoves) {
      this.performAction('has_solution_in', {
        nr_moves: nrMoves
      });
    },

    /**
     * Called when a certain row and column on the board have been clicked.
     * @param row
     * @param column
     */
    clickedBoard(row, column) {
      const reachedCurrentGoal = this.board.click(row, column);

      // If the current goal has been reached
      if (reachedCurrentGoal && this.canProvideMoves) {
        this.performAction('solution_moves', {
          moves: this.board.moves
        });
      }
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

    if (data.message) {
      switch (data.message.action) {
        // Starts a new game.
        case 'start':
          this.startNewGame(data.message);
          break;
        // Somebody has a new best solution!
        case 'has_solution_in':
          this.hasSolutionIn(data.message);
          break;

        // Nobody can provide solutions anymore.
        case 'closed_for_solutions':
          this.closedForSolutions(data.message);
          break;

        // The best so far can't provide his moves anymore.
        case 'closed_for_moves':
          this.closedForMoves(data.message);
          break;
      }
    }
  },

  /**
   * Starts a new game.
   * @param messageData
   */
  startNewGame(messageData) {
    const board = this.store.createRecord('board', {
      cells: messageData.cells,
      goals: messageData.goals,
      robotColors: messageData.robot_colors
    });

    board.setRobotPositions(messageData.robot_positions);
    board.setCurrentGoal(messageData.current_goal);
    this.set('board', board);
  },

  /**
   * Called when a user claims to have a solution in
   * a certain number of steps.
   * @param messageData
   */
  hasSolutionIn(messageData) {
    const bestSoFar = messageData.current_winner,
      nrMoves = messageData.current_nr_moves;

    this.gameLog.addEvent({
      message: `${bestSoFar} has a solution in ${nrMoves} moves!`
    });
  },

  /**
   * The time to provide a (better) solutions for the current
   * goal expired. If the user is the best so far, he can
   * provide moves.
   * @param messageData
   */
  closedForSolutions(messageData) {
    const bestSoFar = messageData.current_winner,
      bestSoFarId = messageData.current_winner_id;

    this.setProperties({
      cantProvideSolution: true,
      canProvideMoves: (this.user.get('id') === bestSoFarId)
    });
    this.gameLog.addEvent({
      message: `Time's up! Waiting for ${bestSoFar} to provide his moves.`
    });
  },

  /**
   * Nobody can provide moves anymore.
   */
  closedForMoves() {
    this.set('canProvideMoves', false);
    this.gameLog.addEvent({
      message: `The winner can't provide moves anymore.`
    });
  }
});
