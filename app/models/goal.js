import Ember from 'ember';

/**
 * Represents a goal on the board a robot has to
 * get to.
 */
export default Ember.Object.extend({
  /**
   * Contains the rendering context.
   */
  context: null,

  /**
   * Whether or not the goal has been reached.
   */
  reached: false,

  /**
   * Goal type and color.
   */
  type: null,
  color: null,

  /**
   * Cell the goal is in
   */
  cell: null,

  /**
   * Draws the goal in the cell.
   */
  draw() {
    let context = this.get('context'),
      type = this.get('type'),
      color = this.get('color'),
      cell = this.get('cell'),
      cellSize = cell.get('size'),
      imageSize = Math.floor(cellSize / 1.3),
      offset = Math.floor((cellSize - imageSize) / 2),
      image = document.getElementById(type + '_' + color);

    context.drawImage(image, cell.get('x') + offset, cell.get('y') + offset, imageSize, imageSize);
  }
})
