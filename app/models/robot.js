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
   * The cell the robot should move to (if any).
   */
  targetCell: null,

  /**
   * Coordinates of the robot.
   */
  x: null,
  y: null,
  radius: null,

  /**
   * The color of the robot.
   */
  color: null,

  /**
   * Whether or not the robot is moving.
   */
  moving: false,

  /**
   * Speed at which the robot should move.
   */
  speed: 15,

  /**
   * Holds the last made snapshot we can revert to.
   */
  _snapshot: null,

  /**
   * Draws the robot.
   */
  draw() {
    let cell = this.get('cell'),
      cellSize = cell.get('size'),
      coordinates = this.getCoordinates(),
      xPos = coordinates.x,
      yPos = coordinates.y,
      radius = cellSize / 4,
      context = this.get('context');

    this.setProperties({
      x: xPos,
      y: yPos,
      radius: radius
    });

    context.beginPath();
    context.arc(xPos, yPos, radius, 0, 2 * Math.PI, false);
    context.fillStyle = this.get('color');
    context.fill();
  },

  /**
   * Gets the coordinates for the robot.
   * @returns {{x: *, y: *}}
   */
  getCoordinates() {
    let cell = this.get('cell'),
      targetCell = this.get('targetCell'),
      moving = this.get('moving');

    if (moving) {
      // Check if we have reached the target
      if (this.get('x') === targetCell.get('xCenter') &&
        this.get('y') === targetCell.get('yCenter')) {
        this.setProperties({
          cell: targetCell,
          targetCell: null,
          moving: false
        });
        return {
          x: this.get('x'),
          y: this.get('y')
        }
      } else {
        // We haven't reached the target cell yet, keep moving.
        return this.moveCoordinates();
      }
    } else if (targetCell) {
      // The robot should move to a new target cell.
      return this.moveCoordinates();
    } else {
      // The robot stays in the cell.
      return {
        x: cell.get('xCenter'),
        y: cell.get('yCenter')
      }
    }
  },

  /**
   * Checks if the robot has to move and returns the proper coordinates.
   * @returns {*}
   */
  moveCoordinates() {
    let currentX = this.get('x'),
      currentY = this.get('y'),
      targetCell = this.get('targetCell'),
      targetX = targetCell.get('xCenter'),
      targetY = targetCell.get('yCenter'),
      speed = this.get('speed');

    this.set('moving', true);

    // The robot needs to move vertically.
    if (targetX === currentX) {

      // The robot needs to move upwards.
      if (targetY < currentY) {
        let diff = (currentY - targetY);
        currentY -= (diff < speed ? diff : speed)
      } else {
        // The robot needs to move downwards.
        let diff = (targetY - currentY);
        currentY += (diff < speed ? diff : speed)
      }

      return {
        x: currentX,
        y: currentY
      }
    } else {
      // The robot needs to move horizontally.
      if (targetX < currentX) {
        let diff = (currentX - targetX);
        currentX -= (diff < speed ? diff : speed)
      } else {
        // The robot needs to move downwards.
        let diff = (targetX - currentX);
        currentX += (diff < speed ? diff : speed)
      }

      return {
        x: currentX,
        y: currentY
      }
    }
  },

  /**
   * Stores the current robot state.
   */
  snapshot() {
    this.set('_snapshot', {
      cell: this.get('cell'),
      targetCell: this.get('targetCell'),
      moving: this.get('moving')
    });
  },

  /**
   * Restores the robot to the previous state.
   */
  restore() {
    this.setProperties(this.get('_snapshot'))
  }
});
