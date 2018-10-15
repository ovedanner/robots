import Component from '@ember/component';
import { inject as service } from '@ember/service';

/**
 * The component that encompasses the entire board.
 */
const BoardDisplay = Component.extend({
  tagName: 'canvas',
  attributeBindings: ['id'],
  id: 'board',

  /**
   * Board drawing service.
   */
  drawService: service('draw'),

  /**
   * The board to display.
   */
  board: null,

  /**
   * Initialize the canvas and the board.
   */
  didInsertElement() {
    const canvas = document.querySelector('canvas'),
      board = this.get('board'),
      draw = this.drawService;

    // These dimensions are also available in the draw service,
    // but here we need them before getting the rendering context
    // (which is needed to initialize the draw service).
    canvas.width = draw.cellSize * board.cells.length;
    canvas.height = draw.cellSize * board.cells[0].length;

    const context = canvas.getContext('2d');

    draw.initialize(board, context);

    // Register the click handler for the canvas.
    canvas.addEventListener('click', (event) => {
      draw.click(event.pageX, event.pageY);
    }, false);

    window.draw = () => {
      draw.draw();
      window.requestAnimationFrame(window.draw);
    };
    window.draw();
  },
});

BoardDisplay.reopenClass({
  positionalParams: ['board']
});

export default BoardDisplay;
