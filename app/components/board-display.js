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
    const canvas = document.querySelector('canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext('2d'),
      board = this.get('board'),
      draw = this.drawService;

    draw.set('context', context);
    draw.initialize(board);

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
