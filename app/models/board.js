import Ember from 'ember';
import Cell from 'ricochet-robots/models/cell';
import cell from "./cell";

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
      cellSize = (fullHeight - (fullHeight % 16)) / 16;
    } else {
      landscape = false;
      margin = (fullHeight - fullWidth) / 2;
      cellSize = (fullWidth - (fullWidth % 16)) / 16;
    }

    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        let xPos = (x * cellSize) + (landscape ? margin : 20),
          yPos = (y * cellSize) + (landscape ? 20 : margin),
          cell = Cell.create({
            x: xPos,
            y: yPos,
            size: cellSize,
            context: context,
            number: (x + (y * 16)) + 1
          });
        cell.draw();
      }
    }
  }

});
