import DS from 'ember-data';
import { alias, readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';

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
   * Returns an array of column cells instead of row cells.
   */
  columnCells: computed('cells', function() {
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
   * Instantiate a new board state.
   */
  init() {
    this._super(...arguments);

    this.set('state', this.store.createRecord('board-state', {
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
