import Ember from 'ember';
import Board from 'ricochet-robots/models/board';

const {$} = Ember;

export default Ember.Component.extend({
  tagName: 'canvas',
  attributeBindings: ['id'],
  id: 'board',

  /**
   * Three.js renderer.
   */
  renderer: null,

  /**
   * Three.js scene.
   */
  scene: null,

  /**
   * Three.js camera.
   */
  camera: null,

  /**
   * Initialize the renderer, scene, camera and board.
   */
  didInsertElement: function() {
    // Make sure the board size is a multiple of 8.
    let boardSize = (window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth);
    if (boardSize % 16 !== 0) {
      boardSize -= boardSize % 16;
    }

    let scene = new THREE.Scene(),
      camera = new THREE.OrthographicCamera(
        boardSize / -2,
        boardSize / 2,
        boardSize / 2,
        boardSize / -2,
        1,
        1000),
      renderer = new THREE.WebGLRenderer({canvas: this.$()[0]}),
      board = new Board({
        renderer: renderer,
        camera: camera,
        scene: scene,
        size: boardSize
      });

    // For some reason I'm not able to capture the click event using
    // Ember's normal event handling.
    $('#board').click(function(event) {
      board.clicked(event);
    });

    // Background color.
    renderer.setClearColor(0xe5e5e5);
    renderer.setSize(boardSize, boardSize);
    this.setProperties({
      renderer: renderer,
      scene: scene,
      camera: camera
    });
    board.initialize(scene);

    let animate = function() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();
  }

});
