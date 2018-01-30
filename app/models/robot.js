import Ember from 'ember';

/**
 * Represents a robot on the board.
 */
export default Ember.Object.extend({
  /**
   * Contains the rendering context.
   */
  context: null,

  /**
   * The cell the robot is currently on.
   */
  cell: null,

  /**
   * The color of the robot.
   */
  color: null,

  /**
   * Draws the robot.
   */
  draw() {
    let cell = this.get('cell'),
      cellSize = cell.get('size'),
      xPos = cell.get('x') + (cellSize / 2),
      yPos = cell.get('y') + (cellSize / 2),
      radius = cellSize / 4,
      context = this.get('context');

    context.beginPath();
    context.arc(xPos, yPos, radius, 0, 2 * Math.PI, false);
    context.fillStyle = this.get('color');
    context.fill();
  }
});
