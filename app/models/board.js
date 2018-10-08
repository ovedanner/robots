import DS from 'ember-data';
import BoardState from './board-state';
import { alias } from '@ember/object/computed';

/**
 * Represents a board.
 */
export default DS.Model.extend({

  /**
   * Cells of the board, defined by their walls.
   */
  cells: DS.attr(),

  /**
   * Goal cells of the board
   */
  goals: DS.attr(),

  /**
   * Board state.
   */
  state: null,

  /**
   * Current number of moves.
   */
  currentNrMoves: alias('state.moves.length'),

  /**
   * Instantiate a new board state.
   */
  init() {
    this._super(...arguments);

    this.set('state', BoardState.create({
      board: this,
    }));
  },

  /**
   * Starts a new game.
   */
  startNewGame() {
    this.state.startNewGame();
  },

});
