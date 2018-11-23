import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import ActionCableSupport from '../mixins/action-cable-support';

/**
 * Encompasses the multiplayer board.
 */
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
   * Is the game ready for the next goal?
   */
  readyForNextGoal: false,

  /**
   * Does the user own the room? If so, he has more controls.
   */
  userOwnsRoom: computed('user.id', 'room.owner.id', function () {
    return this.user.get('id') === this.room.owner.get('id');
  }),

  /**
   * Timer for the amount of time left to come up with a solution.
   */
  solutionTimerTask: task(function* () {
    this.set('solutionTimer', 10);

    for (let i = 0; i < 10; i++) {
      yield timeout(1000);
      this.decrementProperty('solutionTimer');
    }
  }).drop(),

  /**
   * Timer for the amount of time left to come up with the right moves.
   */
  movesTimerTask: task(function* () {
    this.set('movesTimer', 60);

    for (let i = 0; i < 60; i++) {
      yield timeout(1000);
      this.decrementProperty('movesTimer');
    }
  }).drop(),

  actions: {
    /**
     * Start a new game.
     */
    startNewGame() {
      this.performAction('start_new_game');
    },

    /**
     * Resets board moves.
     */
    resetMoves() {
      this.board.resetRobotsToStart();
    },

    /**
     * Get the next goal.
     */
    getNextGoal() {
      this.performAction('next_goal');
    },

    /**
     * Claim to have a solution in the given number of moves.
     * @param nrMoves
     */
    sendNumberOfMoves(nrMoves) {
      this.performAction('has_solution_in', {
        nr_moves: nrMoves,
      });

      // Reset the input field
      this.set('nrMoves', null);
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
          moves: this.board.moves,
        });
      }
    },

    /**
     * Make sure the game controls and log have the appropriate height.
     * @param width
     * @param height
     */
    boardSizeCalculated(width, height) {
      document.getElementById('game-controls').style.height = `${height}px`;
      document.getElementById('game-log').style.height = `${height}px`;
    },
  },

  /**
   * Initialize events array and setup socket stuff.
   */
  didInsertElement(...args) {
    this._super(args);

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
      room: this.room.id,
    });
  },

  /**
   * Called whenever a message is received.
   * @param event
   */
  socketMessage(event) {
    const data = JSON.parse(event.data);

    if (data.message && data.message.action) {
      this[data.message.action.camelize()].call(this, data.message);
      // switch (data.message.action) {
      //   // Starts a new game.
      //   case 'start':
      //     this.startNewGame(data.message);
      //     break;
      //   // Somebody has a new best solution!
      //   case 'has_solution_in':
      //     this.hasSolutionIn(data.message);
      //     break;
      //
      //   // Nobody can provide solutions anymore.
      //   case 'closed_for_solutions':
      //     this.closedForSolutions(data.message);
      //     break;
      //
      //   // The best so far can't provide his moves anymore.
      //   case 'closed_for_moves':
      //     this.closedForMoves(data.message);
      //     break;
      //
      //   case 'goal_won_by':
      //     this.goalWonBy(data.message);
      //     break;
      //
      //   case 'new_goal':
      //     this.newGoal(data.message);
      //     break;
      //
      //   case 'game_finished':
      //     this.gameFinished();
      //     break;
      // }
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
      robotColors: messageData.robot_colors,
    });

    board.setRobotPositions(messageData.robot_positions);
    board.setCurrentGoal(messageData.current_goal);

    this.setProperties({
      board,
      cantProvideSolution: false,
      canProvideMoves: false,
    });

    this.gameLog.addEvent({
      message: 'New board!',
    });
  },

  /**
   * Called when a user claims to have a solution in
   * a certain number of steps.
   * @param messageData
   */
  hasSolutionIn(messageData) {
    this.solutionTimerTask.perform();

    const bestSoFar = messageData.current_winner;
    const nrMoves = messageData.current_nr_moves;

    this.gameLog.addEvent({
      message: `${bestSoFar} has a solution in ${nrMoves} moves!`,
    });
  },

  /**
   * The time to provide a (better) solutions for the current
   * goal expired. If the user is the best so far, he can
   * provide moves.
   * @param messageData
   */
  closedForSolutions(messageData) {
    this.solutionTimerTask.cancelAll();
    this.movesTimerTask.perform();

    const bestSoFar = messageData.current_winner;
    const bestSoFarId = messageData.current_winner_id;

    this.setProperties({
      cantProvideSolution: true,
      canProvideMoves: (parseInt(this.user.get('id'), 10) === bestSoFarId),
    });

    this.gameLog.addEvent({
      message: `Time's up! Waiting for ${bestSoFar} to provide his moves.`,
    });
  },

  /**
   * Nobody can provide moves anymore.
   */
  closedForMoves() {
    this.movesTimerTask.cancelAll();
    this.setProperties({
      readyForNextGoal: true,
      canProvideMoves: false,
    });

    this.gameLog.addEvent({
      message: 'The winner can\'t provide moves anymore.',
    });
  },

  /**
   * There is a new goal!
   * @param messageData
   */
  newGoal(messageData) {
    this.setProperties({
      readyForNextGoal: false,
      cantProvideSolution: false,
      canProvideMoves: false,
    });

    this.board.setCurrentGoal(messageData.goal);
  },

  /**
   * The goal is won by.
   * @param messageData
   */
  goalWonBy(messageData) {
    this.movesTimerTask.cancelAll();
    this.setProperties({
      readyForNextGoal: true,
      canProvideMoves: false,
    });

    this.gameLog.addEvent({
      message: `The round is won by ${messageData.winner}!`,
    });
  },

  /**
   * No more goals, the game is finished!
   */
  gameFinished() {
    this.board.setCurrentGoal(null);

    this.gameLog.addEvent({
      message: 'The game is finished!',
    });
  },
});
