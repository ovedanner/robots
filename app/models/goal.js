import Ember from 'ember';

/**
 * Map of color name to actual RGB value.
 * @type {{blue: string, red: string, yellow: string, green: string}}
 */
const colorMap = {
  blue: '#7EA7D2',
  red: '#F58C8F',
  yellow: '#FEF87D',
  green: '#C3E17E'
};

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
   * Holds the last made snapshot we can revert to.
   */
  _snapshot: null,

  /**
   * Returns the real background color for the goal.
   */
  backgroundColor: Ember.computed('color', {
    get() {
      return colorMap[this.get('color')];
    }
  }),

  /**
   * Stores the current goal state.
   */
  snapshot() {
    this.set('_snapshot', {
      reached: this.get('reached')
    });
  },

  /**
   * Restores the goal to the previous state.
   */
  restore() {
    this.setProperties(this.get('_snapshot'))
  }
})
