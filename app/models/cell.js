import Ember from 'ember';

/**
 * Represents a cell on the board.
 */
export default Ember.Object.extend({
  /**
   * Contains the rendering context.
   */
  context: null,

  /**
   * Position and size of the cell.
   */
  x: null,
  y: null,
  size: null,

  /**
   * Cell number, calculated from top left to
   * bottom right.
   */
  number: null,

  /**
   * Bitmask for the cell walls:
   * - top: 1
   * - right: 2
   * - bottom: 4
   * - left: 8
   * Note that this doesn't include the outer walls of
   * the board.
   */
  walls: 0,

  /**
   * Size of the walls.
   */
  wallSize: 4,

  /**
   * Color of the cell.
   */
  cellColor: '#ECDED1',

  /**
   * Color of the cell walls.
   */
  wallColor: '#7D7B7A',

  /**
   * The board layout. Used to determine if this cell contains
   * a goal and if so, which goal.
   */
  layout: null,

  /**
   * Draws this cell including its borders.
   */
  draw() {
    let context = this.get('context'),
      x = this.get('x'),
      y = this.get('y'),
      size = this.get('size'),
      number = this.get('number');

    // Check for the middle of the board. If not,
    // simply draw the borders.
    if (number === 120 || number === 121 || number === 136 || number === 137) {
      context.fillStyle = 'black';
      context.fillRect(x, y, size, size);
    } else {
      context.fillStyle = this.get('cellColor');
      context.fillRect(x, y, size, size);
      this.drawBorders();
    }
  },

  /**
   * Draws the borders of the cell.
   */
  drawBorders() {
    let context = this.get('context'),
      x = this.get('x'),
      y = this.get('y'),
      size = this.get('size'),
      walls = this.get('walls'),
      wallColor = this.get('wallColor'),
      wallSize = this.get('wallSize'),
      number = this.get('number'),
      wallMultiplier,
      top = (walls & 1) > 0,
      right = (walls & 2) > 0,
      bottom = (walls & 4) > 0,
      left = (walls & 8) > 0;

    // Background cell borders.
    context.strokeStyle = '#3B3E40';
    context.strokeRect(x, y, size, size);

    if (top || number <= 16) {
      wallMultiplier = (number <= 16 ? 2 : 1);
      context.fillStyle = wallColor;
      context.fillRect(x, y, size, (wallSize * wallMultiplier));
    }
    if (right || (number % 16 === 0)) {
      wallMultiplier = (number % 16 === 0 ? 2 : 1);
      context.fillStyle = wallColor;
      context.fillRect((x + size) - (wallSize * wallMultiplier), y, (wallSize * wallMultiplier), size);
    }
    if (bottom || (number > 240)) {
      wallMultiplier = (number > 240 ? 2 : 1);
      context.fillStyle = wallColor;
      context.fillRect(x, (y + size) - (wallSize * wallMultiplier), size, (wallSize * wallMultiplier));
    }
    if (left || (number % 16 === 1)) {
      wallMultiplier = (number % 16 === 1 ? 2 : 1);
      context.fillStyle = wallColor;
      context.fillRect(x, y, (wallSize * wallMultiplier), size);
    }
  }

});
