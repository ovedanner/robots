import Ember from 'ember';
import Board from 'ricochet-robots/models/board';

/**
 * The component that encompasses the entire board.
 */
export default Ember.Component.extend({
  tagName: 'canvas',
  attributeBindings: ['id'],
  id: 'board',

  /**
   * Initialize the canvas and the board.
   */
  didInsertElement() {
    let canvas = document.querySelector('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let context = canvas.getContext('2d'),
      board = Board.create({context: context});

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
