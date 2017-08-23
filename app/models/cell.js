import Ember from 'ember';
import THREE from 'npm:three';

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
   * left, top, right, bottom
   */
  walls: [],

  /**
   * Cell number (used to conveniently locate
   * adjacent cells).
   */
  number: null,

  hasLeftWall: Ember.computed('walls.[]', function() {
    return this.get('walls.0')
  }),

  hasTopWall: Ember.computed('walls.[]', function() {
    return this.get('walls.1')
  }),

  hasRightWall: Ember.computed('walls.[]', function() {
    return this.get('walls.2')
  }),

  hasBottomWall: Ember.computed('walls.[]', function() {
    return this.get('walls.3')
  }),

  /**
   * Initializes the cell and places it in the scene.
   * @param scene
   */
  initialize(scene) {
    let size = this.get('size'),
      x = this.get('x'),
      y = this.get('y'),
      depth = this.get('depth');
    let geometry = new THREE.BoxGeometry(size, size, size);
    let material = new THREE.MeshBasicMaterial({
      color: 0xe5e5e5,
      map: this.getTexture(),
      transparent: true
    });
    let mesh = new THREE.Mesh(geometry, material);
    this.set('mesh', mesh);
    mesh.position.set(x, y, depth);
    scene.add(mesh);
  },

  /**
   * Retrieves the texture based on the walls.
   */
  getTexture() {
    let filename = [];
    this.get('walls').forEach(function(wall, index) {
      if (wall) {
        switch (index) {
          case 0:
            filename.pushObject('left');
            break;
          case 1:
            filename.pushObject('top');
            break;
          case 2:
            filename.pushObject('right');
            break;
          case 3:
            filename.pushObject('bottom');
            break;
        }
      }
    });
    if (filename.length === 0) {
      filename = 'none.png';
    } else {
      filename = filename.join('_') + '.png';
    }
    return new THREE.TextureLoader().load('assets/textures/' + filename);
  }

});
