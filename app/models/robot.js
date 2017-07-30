import Ember from 'ember';

/**
 * Represents a robot on the board.
 */
export default Ember.Object.extend({
  /**
   * Robot size.
   */
  size: null,

  /**
   * Robot coordinates.
   */
  x: null,
  y: null,

  /**
   * Depth of drawing.
   */
  depth: -800,

  /**
   * The actual robot object.
   */
  mesh: null,

  /**
   * The cell the robot is currently at.
   */
  currentCell: null,

  /**
   * Initializes the robot and places it in the scene.
   * @param scene
   */
  initialize(scene) {
    let size = this.get('size');
    let geometry = new THREE.ConeGeometry(size, 1000, 32);
    let material = new THREE.MeshBasicMaterial({
      color: 0xfaca41
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(Math.PI / -2);
    this.set('mesh', mesh);
    mesh.position.set(0, 0, this.get('depth'));
    scene.add(mesh);
  },

  /**
   * Sets the position of the robot.
   * @param cell
   */
  setPosition(cell) {
    this.setProperties(cell.getProperties('x', 'y'));
    this.set('currentCell', cell);
    this.get('mesh').position.set(this.get('x'), this.get('y'), this.get('depth'));
  }

});
