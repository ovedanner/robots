import Ember from 'ember';

/**
 * Represents a board.
 */
export default Ember.Object.extend({
  /**
   * Contains the rendering context.
   */
  context: null,

  /**
   * Holds all the board's cells.
   */
  cells: [],

  /**
   * Draws the board.
   */
  draw() {
    let context = this.get('context'),
      canvas = context.canvas,
      fullWidth = canvas.clientWidth - 40,
      fullHeight = canvas.clientHeight - 40,
      cellSize, margin, landscape = true;

    if (fullHeight < fullWidth) {
      margin = (fullWidth - fullHeight) / 2;
      cellSize = (fullHeight - (fullHeight % 8)) / 8;
    } else {
      landscape = false;
      margin = (fullHeight - fullWidth) / 2;
      cellSize = (fullWidth - (fullWidth % 8)) / 8;
    }

    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 8; x++) {
        let xPos = (x * cellSize) + (landscape ? margin : 20),
          yPos = (y * cellSize) + (landscape ? 20 : margin);
        context.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * y) + ',' +
          Math.floor(255 - 42.5 * x) + ',0)';
        context.fillRect(xPos, yPos, cellSize, cellSize);
      }
    }
  }

});
