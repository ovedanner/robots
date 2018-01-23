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
    board.draw();
  },
});
