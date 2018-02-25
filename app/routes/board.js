import Ember from 'ember';
import Board from 'ricochet-robots/models/board';

export default Ember.Route.extend({
  model() {
    return Board.create();
  }
});
