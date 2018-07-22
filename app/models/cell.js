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
   * The robot on the cell (if any).
   */
  robot: null,

  /**
   * The goal in this cell (if any).
   */
  goal: null,

  /**
   * Whether or not to even draw borders.
   */
  borders: true,

  /**
   * Holds the last made snapshot we can revert to.
   */
  _snapshot: null,

  /**
   * Whether or not the cell has a top wall.
   */
  hasTopWall: Ember.computed('walls', 'number', {
    get() {
      return (this.get('walls') & 1) > 0 || this.get('number') <= 16;
    }
  }),

  /**
   * Whether or not the cell has a right wall.
   */
  hasRightWall: Ember.computed('walls', 'number', {
    get() {
      return (this.get('walls') & 2) > 0 || (this.get('number') % 16 === 0);
    }
  }),

  /**
   * Whether or not the cell has a bottom wall.
   */
  hasBottomWall: Ember.computed('walls', 'number', {
    get() {
      return (this.get('walls') & 4) > 0 || (this.get('number') > 240);
    }
  }),

  /**
   * Whether or not the cell has a left wall.
   */
  hasLeftWall: Ember.computed('walls', {
    get() {
      return (this.get('walls') & 8) > 0 || (this.get('number') % 16 === 1);
    }
  }),

  /**
   * X coordinate of the middle of the cell.
   */
  xCenter: Ember.computed('x', 'size', {
    get() {
      return this.get('x') + Math.floor(this.get('size') / 2);
    }
  }),

  /**
   * Y coordinate of the middle of the cell.
   */
  yCenter: Ember.computed('y', 'size', {
    get() {
      return this.get('y') + Math.floor(this.get('size') / 2);
    }
  }),

  /**
   * Draws this cell including its borders.
   */
  draw() {
    let context = this.get('context'),
      goal = this.get('goal'),
      x = this.get('x'),
      y = this.get('y'),
      size = this.get('size'),
      backgroundColor = this.get('cellColor'),
      number = this.get('number');

    // The color to draw depends on whether there is a goal and if that
    // goal is the current one.
    if (goal && goal.get('current')) {
      backgroundColor = goal.get('backgroundColor');
    }

    // Check for the middle of the board. If not,
    // simply draw the borders.
    if (number === 120 || number === 121 || number === 136 || number === 137) {
      context.fillStyle = 'gray';
      context.fillRect(x, y, size, size);
    } else {
      context.fillStyle = backgroundColor;
      context.fillRect(x, y, size, size);
      if (this.get('borders')) {
        this.drawBorders();
      }
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
  },

  /**
   * Stores the current cell state.
   */
  snapshot() {
    let goal = this.get('goal');
    if (goal) {
      goal.snapshot();
    }
    this.set('_snapshot', {
      robot: this.get('robot'),
      goal: goal
    });
  },

  /**
   * Restores the cell to the previous state.
   */
  restore() {
    let _snapshot = this.get('_snapshot');
    if (_snapshot.goal) {
      _snapshot.goal.restore();
    }
    this.setProperties(this.get('_snapshot'))
  }
});
