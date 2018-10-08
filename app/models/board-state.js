import EmberObject from '@ember/object';

/**
 * Board state.
 */
export default EmberObject.extend({

  /**
   * Holds the robots and their current position
   * on the board.
   */
  robots: null,

  /**
   * The board.
   */
  board: null,

  /**
   * The moves that belong to the current play.
   */
  moves: null,

  /**
   * Whether or not a play has started.
   */
  playStarted: false,

  /**
   * The current goal to work towards.
   */
  currentGoal: null,

  /**
   * Initialize the robots the random spots on the board.
   */
  init() {
    this._super(...arguments);

    // Initialize the robots.
    this.initializeRobots();
  },

  /**
   * Initializes the robots on the board.
   */
  initializeRobots() {
    const board = this.board,
      cells = board.cells,
      nrRows = cells.length,
      nrColumns = nrRows,
      positions = [],
      robots = [];

    // A robot can never be in a cell with four walls.
    for (let i = 0; i < nrRows; i++) {
      for (let j = 0; j < nrColumns; j++) {
        if (cells[i][j] !== 15) {
          positions.push({
            row: i,
            column: j,
          });
        }
      }
    }

    ['yellow', 'red', 'blue', 'green', 'silver'].forEach((color) => {
      let index = Math.floor((Math.random() * positions.length)),
        position = positions[index];

      // Remove the position, so no two robots will begin in the same spot.
      positions.removeObject(position);

      // Convert the index to row and column indices.
      robots.push({
        color: color,
        position: {
          row: position.row,
          column: position.column,
        }
      });
    });

    this.set('robots', robots);
  },

  startGame() {

  }
});
