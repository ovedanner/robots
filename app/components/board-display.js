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
    let canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let context = canvas.getContext('2d'),
      board = this.get('board');

    this.drawService.set('context', context);
    this.drawService.initialize(board);

    // Register the click handler for the canvas.
    canvas.addEventListener('click', (event) => {
      let x = event.pageX,
        y = event.pageY;
      board.click(x, y);
    }, false);

    window.draw = () => {
      this.drawService.draw();
      window.requestAnimationFrame(window.draw);
    };
    window.draw();
  },
});

BoardDisplay.reopenClass({
  positionalParams: ['board']
});

export default BoardDisplay;
