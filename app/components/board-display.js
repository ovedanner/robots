import Component from '@ember/component';

/**
 * The component that encompasses the entire board.
 */
const BoardDisplay = Component.extend({
  tagName: 'canvas',
  attributeBindings: ['id'],
  id: 'board',

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
    board.set('context', context);

    // Register the click handler for the canvas.
    canvas.addEventListener('click', (event) => {
      let x = event.pageX,
        y = event.pageY;
      board.click(x, y);
    }, false);

    board.initialize();

    window.draw = () => {
      board.draw();
      window.requestAnimationFrame(window.draw);
    };
    window.draw();
  },
});

BoardDisplay.reopenClass({
  positionalParams: ['board']
});

export default BoardDisplay;
