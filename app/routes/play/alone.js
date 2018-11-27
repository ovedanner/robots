import Route from '@ember/routing/route';

/**
 * Route for playing a game.
 */
export default Route.extend({
  /**
   * Fetch a board to play.
   */
  model() {
    // Because getting a random board does not actually save a record
    // in the database, we can't use `queryRecord` or `findRecord`.
    return this.ajax.request('boards/random').then((resp) => {
      const attrs = resp.data.attributes;
      return this.store.createRecord('board', {
        cells: attrs.cells,
        goals: attrs.goals,
        robotColors: attrs['robot-colors'],
      });
    });
  },
});
