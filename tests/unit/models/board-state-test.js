import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | board state', function(hooks) {
  setupTest(hooks);

  test('create board creates state', function(assert) {
    const board = this.owner.lookup('service:store').createRecord('board', {
        cells: [
          [1, 4, 12, 3],
          [12, 7, 1, 3],
          [2, 2, 2, 4],
          [10, 1, 1, 6],
        ],
        goals: [
          {
            color: 'red',
            number: 2,
          },
          {
            color: 'blue',
            number: 7,
          }
        ],
        robotColors: ['red', 'blue'],
      });

    assert.ok(board.state, 'Newly created board has state.');
  });

  test('robots are properly initialized', function(assert) {
    assert.expect(8);

    const board = this.owner.lookup('service:store').createRecord('board', {
        cells: [
          [1, 4, 12, 3],
          [12, 7, 1, 3],
          [2, 2, 2, 4],
          [10, 1, 1, 6],
        ],
        goals: [
          {
            color: 'red',
            number: 2,
          },
          {
            color: 'blue',
            number: 7,
          }
        ],
        robotColors: ['red', 'blue'],
      }),
      state = board.state;

    board.initializeRobots();

    let remainingColors = ['red', 'blue'];

    assert.equal(state.robots.length, 2, 'All robots are added to the board state.');

    state.robots.forEach((robot) => {
      const pos = robot.position;

      assert.ok(remainingColors.includes(robot.color), 'Robot has proper color.');
      remainingColors.removeObject(robot.color);

      assert.ok(pos.row >= 0 && pos.row <= 3, 'Robot row position is on the board.');
      assert.ok(pos.column >= 0 && pos.column <= 3, 'Robot column position is on the board.');
    });

    assert.equal(state.currentGoal, null, 'Initializing robots does not set current goal.');
  });

  test('set current goal', function(assert) {
    assert.expect(4);

    const goals = [
      {
        color: 'red',
        number: 2,
      },
      {
        color: 'blue',
        number: 7,
      }
    ],
      board = this.owner.lookup('service:store').createRecord('board', {
        cells: [
          [1, 4, 12, 3],
          [12, 7, 1, 3],
          [2, 2, 2, 4],
          [10, 1, 1, 6],
        ],
        goals: goals,
        robotColors: ['red', 'blue'],
      }),
      state = board.state;

    board.initializeRobots();
    board.setCurrentGoal(goals[1]);

    const robots = state.robots;

    assert.deepEqual(state.currentGoal, goals[1], 'Board state has proper current goal.');
    assert.deepEqual(state.moves, [], 'Board state does not contain any moves.');
    assert.equal(state.selectedRobot, null, 'Board state has no selected robot.');
    assert.deepEqual(state.start, robots, 'Board state start equals robot colors / positions.');
  });

  test('clicking robot selects robot', function(assert) {
    assert.expect(3);

    const goals = [
        {
          color: 'red',
          number: 2,
        },
        {
          color: 'blue',
          number: 7,
        }
      ],
      board = this.owner.lookup('service:store').createRecord('board', {
        cells: [
          [1, 4, 12, 3],
          [12, 7, 1, 3],
          [2, 2, 2, 4],
          [10, 1, 1, 6],
        ],
        goals: goals,
        robotColors: ['red', 'blue'],
      }),
      state = board.state;

    board.initializeRobots();
    board.setCurrentGoal(goals[0]);

    const robotOne = state.robots[0],
      robotStartRow = robotOne.position.row,
      robotStartColumn = robotOne.position.column;

    state.click(robotStartRow, robotStartColumn);

    assert.deepEqual(state.selectedRobot, robotOne, 'Robot is properly selected after click.');
    assert.equal(state.robots[0].position.row, robotStartRow, 'Robot did not move row after clicking it.');
    assert.equal(state.robots[0].position.column, robotStartColumn, 'Robot did not move column after clicking it.');
  });

  test('robot can move horizontally and vertically', function(assert) {
    assert.expect(6);

    const board = this.owner.lookup('service:store').createRecord('board', {
        cells: [
          [9, 1, 1, 3],
          [8, 0, 0, 2],
          [8, 0, 0, 2],
          [12, 4, 4, 6],
        ],
        goals: [
          {
            color: 'red',
            number: 2,
          },
        ],
        robotColors: ['red'],
      }),
      state = board.state;

    board.initializeRobots();
    board.setCurrentGoal({
      color: 'red',
      number: 2,
    });

    // Manually set the robot to a known position.
    const robotOne = state.robots[0];

    robotOne.position.row = 1;
    robotOne.position.column = 2;

    // Valid horizontal and vertical moves.
    assert.ok(state.canMoveToCell(1, 2, 0, 2), 'Robot can move up');
    assert.ok(state.canMoveToCell(1, 2, 1, 3), 'Robot can move right');
    assert.ok(state.canMoveToCell(1, 2, 3, 2), 'Robot can move down');
    assert.ok(state.canMoveToCell(1, 2, 1, 0), 'Robot can move left');

    // Try a few invalid horizontal and vertical moves.
    assert.notOk(state.canMoveToCell(1, 2, 2, 2), 'Robot can not move down to cell without borders.');
    assert.notOk(state.canMoveToCell(1, 2, 1, 1), 'Robot can not move left to cell without borders.');
  });
});
