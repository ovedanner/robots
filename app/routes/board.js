import Route from '@ember/routing/route';
import Board from 'ricochet-robots/models/board';

export default Route.extend({
  model() {
    return Board.create();
  }
});
