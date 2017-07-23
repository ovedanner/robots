import Ember from 'ember';

/**
 * Represents a cell on the board.
 */
export default Ember.Object.extend({
  /**
   * Cell size.
   */
  size: null,

  /**
   * Cell coordinates.
   */
  x: null,
  y: null,
  depth: null,

  /**
   * The actual cell object.
   */
  mesh: null,

  /**
   * Walls of the cell, contains booleans:
   * top, right, bottom, left.
   */
  walls: [],

  /**
   * Initializes the cell and places it in the scene.
   * @param scene
   */
  initialize: function(scene) {
    let size = this.get('size'),
      x = this.get('x'),
      y = this.get('y'),
      depth = this.get('depth');
    let geometry = new THREE.BoxGeometry(size, size, size);
    //let texture = new THREE.TextureLoader().load("assets/textures/test.jpg");
    let material = new THREE.MeshBasicMaterial({
      color: 0xe5e5e5 * Math.random(),
      //map: texture
    });
    let mesh = new THREE.Mesh(geometry, material);
    this.set('mesh', mesh);
    mesh.position.set(x, y, depth);
    scene.add(mesh);
  }

});
