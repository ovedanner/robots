import Ember from 'ember';

const {$} = Ember;

export default Ember.Component.extend({
  attributeBindings: ['id'],
  id: 'board',

  didInsertElement: function() {
    let scene = new THREE.Scene(),
      element = this.$(),
      camera = new THREE.PerspectiveCamera(75, element.innerWidth / element.innerHeight, 0.1, 1000);

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(element.innerWidth, element.innerHeight);
    element.append(renderer.domElement);
  }

});
