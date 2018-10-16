import DS from 'ember-data';
import { alias, readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

/**
 * Represents a board.
 */
export default DS.Model.extend({
  /**
   * Game service.
   */
  gameService: service('game'),

  /**
   * Cells of the board, defined by their walls.
   */
  cells: DS.attr(),

  /**
   * Goal cells of the board
   */
  goals: DS.attr(),

  /**
   * Robots that can participate.
   */
  robotColors: DS.attr(),

  /**
   * Whether or not this board is finished (all goals are reached).
   */
  finished: false,

  /**
   * Returns an array of column cells instead of row cells.
   */
  columnCells: computed('cells.length', function() {
    const cells = this.cells;
    let columns = [];

    for (let i = 0; i < cells.length; i++) {
      let column = [];

      for (let j = 0; j < cells.length; j++) {
        column.push(cells[j][i]);
      }

      columns.push(column);
    }

    return columns;
  }),

  /**
   * We assume square boards with at least one cell.
   */
  nrRows: readOnly('cells.length'),
  nrColumns: readOnly('cells.0.length'),

  /**
   * Board state.
   */
  state: null,

  /**
   * Current number of moves.
   */
  currentNrMoves: alias('state.moves.length'),

  /**
   * Instantiate a new board state and register the board
   * with the game service.
   */
  init() {
    this._super(...arguments);

    this.set('state', this.store.createRecord('board-state', {
      board: this,
    }));

    this.gameService.registerBoard(this);
  },

  /**
   * Reset state.
   */
  reset() {
    this.state.reset();
  },

  /**
   * Initialize the robots on the board.
   */
  initializeRobots() {
    this.state.initializeRobots();
  },

  /**
   * Returns the current moves on on the board.
   * @returns {null|Array}
   */
  getCurrentMoves() {
    return this.state.moves;
  },

  /**
   * Set the current goal
   * @param goal
   */
  setCurrentGoal(goal) {
    this.state.setCurrentGoal(goal);
  },

  /**
   * Starts a new game.
   */
  startNewGame() {
    this.state.startNewGame();
  },

  /**
   * Resets the robots to the start of the current play.
   */
  resetRobotsToStart() {
    this.state.resetRobotsToStart();
  },

  /**
   * Returns an array with the row and column index of
   * the given goal.
   * @param goal
   * @returns {number[]}
   */
  getGoalIndices(goal) {
    const goalRowIdx = Math.floor(goal.number / this.nrRows),
      goalColumnIdx = goal.number % this.nrColumns;

    return [goalRowIdx, goalColumnIdx];
  },

  /**
   * Returns a unique identifier for the goal.
   * @param goal
   * @returns {string}
   */
  getGoalId(goal) {
    return `${goal.color}_${goal.number}`;
  }
});
