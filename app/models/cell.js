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
   */
  walls: 15,

  /**
   * Size of the walls.
   */
  wallSize: 2,

  /**
   * Color of the cell walls.
   */
  wallColor: 'brown',

  /**
   * Draws this cell including its borders.
   */
  draw() {
    let context = this.get('context'),
      x = this.get('x'),
      y = this.get('y'),
      size = this.get('size');
    context.fillStyle = 'orange';
    context.fillRect(x, y, size, size);

    this.drawBorders();
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

    if (top || number <= 8) {
      wallMultiplier = (number <= 8 ? 2 : 1);
      context.fillStyle = wallColor;
      context.fillRect(x, y, size, (wallSize * wallMultiplier));
    }
    if (right || (number % 8 === 0)) {
      wallMultiplier = (number % 8 === 0 ? 2 : 1);
      context.fillStyle = wallColor;
      context.fillRect((x + size) - (wallSize * wallMultiplier), y, (wallSize * wallMultiplier), size);
    }
    if (bottom || (number > 56)) {
      wallMultiplier = (number > 56 ? 2 : 1);
      context.fillStyle = wallColor;
      context.fillRect(x, (y + size) - (wallSize * wallMultiplier), size, (wallSize * wallMultiplier));
    }
    if (left || (number % 8 === 1)) {
      wallMultiplier = (number % 8 === 1 ? 2 : 1);
      context.fillStyle = wallColor;
      context.fillRect(x, y, (wallSize * wallMultiplier), size);
    }
  }

});
