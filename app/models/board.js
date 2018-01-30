import Ember from 'ember';
import Cell from 'ricochet-robots/models/cell';
import BoardLayout from 'ricochet-robots/models/board-layout';
import Robot from 'ricochet-robots/models/robot';

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
   * Holds the robots.
   */
  robots: [],

  /**
   * Draws the board and everything on it.
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

    // Load the board layout.
    let layout = BoardLayout.create(),
      walls = layout.get('walls');

    // Draw the cells.
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        let xPos = (x * cellSize) + (landscape ? margin : 20),
          yPos = (y * cellSize) + (landscape ? 20 : margin),
          cell = Cell.create({
            x: xPos,
            y: yPos,
            layout: layout,
            walls: walls[y][x],
            size: cellSize,
            context: context,
            number: (x + (y * 16)) + 1
          });
        cell.draw();
        this.get('cells').pushObject(cell);
      }
    }

    // Randomly initialize the robots.
    this.initializeRobots();
  },

  /**
   * Initializes the robots to random cells of the board.
   */
  initializeRobots() {
    let context = this.get('context'),
      cells = this.get('cells'),
      indices = [],
      robots = [];

    // Make sure a robot can never be in the center of the board.
    for (let i = 0; i < 256; i++) {
      if (i !== 120 && i !== 121 && i !== 136 && i !== 137) {
        indices.push(i);
      }
    }

    ['yellow', 'red', 'blue', 'green', 'silver'].forEach(function(color) {
      let index = Math.floor((Math.random() * indices.get('length')) + 1),
        cell = cells.get(index);

      // Remove the index, so no two robots will begin in the same spot.
      indices.removeObject(index);
      let robot = Robot.create({
        cell: cell,
        color: color,
        context: context
      });
      robot.draw();
      robots.pushObject(robot);
    });

    this.set('robots', robots);
  }

});
