import Ember from 'ember';
import Cell from 'ricochet-robots/models/cell';

export default Ember.Object.extend({
  /**
   * The scene object.
   */
  scene: null,

  /**
   * The board size.
   */
  size: null,

  /**
   * Gets board cells.
   * @returns {Array}
   */
  getCells() {
    // Cells are simply one sixteenth of the board.
    let size = this.get('size'),
      cellSize = size / 16,
      scene = this.get('scene');

    // Initialize all cells.
    let cells = [];

    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 16; y++) {
        let cellX = (size / -2) + (x * cellSize) + (cellSize / 2),
          cellY = (size / -2) + (y * cellSize) + (cellSize / 2),
          cell = new Cell({
            walls: this.getWalls(x, y),
            size: cellSize,
            x: cellX,
            y: cellY,
            depth: -1000,
            number: y + (x * 16)
          });
        cell.initialize(scene);
        cells.pushObject(cell);
      }
    }

    cells.forEach(function(cell, index) {

    });

    return cells;
  },

  /**
   * Returns the walls array based on the cell indices.
   * @param xIndex
   * @param yIndex
   * @returns {Array}
   */
  getWalls(xIndex, yIndex) {
    let walls = [],
      leftEdge = false,
      topEdge = false,
      rightEdge = false,
      bottomEdge = false;

    // Left edge or random.
    if (xIndex === 0) {
      leftEdge = true;
    }

    // Top edge or random.
    if (yIndex === 15) {
      topEdge = true;
    }

    // Right edge or random.
    if (xIndex === 15) {
      rightEdge = true;
    }

    // Bottom edge or random.
    if (yIndex === 0) {
      bottomEdge = true;
    }

    walls = [leftEdge, topEdge, rightEdge, bottomEdge];

    return walls;
  }
});
