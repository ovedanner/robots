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
   * The actual robot object.
   */
  mesh: null,

  /**
   * Initializes the robot and places it in the scene.
   * @param scene
   */
  initialize: function(scene) {
    let size = this.get('size');
    let geometry = new THREE.ConeGeometry(size, 1000, 32);
    let material = new THREE.MeshBasicMaterial({
      color: 0xfaca41
    });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(Math.PI / -2);
    this.set('mesh', mesh);
    mesh.position.set(0, 0, -800);
    scene.add(mesh);
  }

});
