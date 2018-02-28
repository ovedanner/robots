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
   * The path the robot has currently taken (if any).
   */
  path: null,

  /**
   * Holds the last made snapshot we can revert to.
   */
  _snapshot: null,

  init() {
    this._super.apply(this, arguments);
    this.set('path', []);
  },

  /**
   * Draws the robot.
   */
  draw() {
    let cell = this.get('cell'),
      cellSize = cell.get('size'),
      radius = cellSize / 4,
      context = this.get('context'),
      targetCell = this.get('targetCell'),
      path = this.get('path'),
      xPos, yPos;

    if (targetCell) {
      xPos = targetCell.get('xCenter');
      yPos = targetCell.get('yCenter');
      this.setProperties({
        cell: targetCell,
        targetCell: null
      });
    } else {
      xPos = cell.get('xCenter');
      yPos = cell.get('yCenter');
    }

    // We only add the current cell to the path if it was not the last
    // cell to be added. Keep in mind that one robot can cross the same
    // path multiple times in one path.
    if (path.get('lastObject') !== this.get('cell')) {
      path.pushObject(this.get('cell'));
    }

    this.setProperties({
      x: xPos,
      y: yPos,
      radius: radius
    });

    // Draw a circle filled with the robot color.
    context.save();
    context.beginPath();
    context.arc(xPos, yPos, radius, 0, 2 * Math.PI, false);
    context.fillStyle = this.get('color');
    context.fill();
    context.restore();

    // Draw a border around the circle.
    context.beginPath();
    context.arc(xPos, yPos, radius, 0, 2 * Math.PI, false);
    context.stroke();
  },

  /**
   * Draws the path this robot has taken so far.
   */
  drawPath() {
    let path = this.get('path'),
      context = this.get('context'),
      from, to;
    context.save();
    if (path.get('length') > 1) {
      for (let i = 0; i < (path.get('length') - 1); i++) {
        // Draw a small circle at the first cell of the path
        // to indicate that the robot used to be here.
        if (i === 0) {
          context.beginPath();
          context.arc(path[i].get('xCenter'), path[i].get('yCenter'),
            path[i].get('size') / 8, 0, 2 * Math.PI, false);
          context.fillStyle = this.get('color');
          context.fill();
        }
        from = path[i];
        to = path[i + 1];
        context.beginPath();
        context.moveTo(from.get('xCenter'), from.get('yCenter'));
        context.lineTo(to.get('xCenter'), to.get('yCenter'));
        context.lineWidth = 4;
        context.strokeStyle = this.get('color');
        context.stroke();
      }
    }
    context.restore();
  },

  /**
   * Stores the current robot state.
   */
  snapshot() {
    this.set('_snapshot', {
      cell: this.get('cell'),
      targetCell: this.get('targetCell')
    });
  },

  /**
   * Restores the robot to the previous state.
   */
  restore() {
    this.setProperties(this.get('_snapshot'));
    this.set('path', []);
  }
});
