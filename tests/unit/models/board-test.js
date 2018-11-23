import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Model | board', (hooks) => {
  setupTest(hooks);

  /**
   * Test basic board properties.
   */
  test('has proper basic properties', function(assert) {
    const cells = [
      [1, 4, 9],
      [15, 1, 1],
      [8, 12, 2],
    ];
    const goals = [
      {
        color: 'red',
        number: 2,
      },
    ];
    const board = this.owner.lookup('service:store').createRecord('board', {
      cells,
      goals,
    });

    assert.ok(board);
    assert.equal(board.nrRows, 3, 'Board has proper row numbers');
    assert.equal(board.nrColumns, 3, 'Board has proper column numbers');
  });

  /**
   * Test transposed (column) cells.
   */
  test('has proper transposed cells', function(assert) {
    const cells = [
      [1, 4, 12, 3],
      [12, 7, 1, 3],
      [2, 2, 2, 4],
      [10, 1, 1, 6],
    ];
    const goals = [
      {
        color: 'red',
        number: 2,
      },
      {
        color: 'blue',
        number: 7,
      },
    ];
    const board = this.owner.lookup('service:store').createRecord('board', {
      cells,
      goals,
    });

    assert.deepEqual(board.columnCells, [
      [1, 12, 2, 10],
      [4, 7, 2, 1],
      [12, 1, 2, 1],
      [3, 3, 4, 6],
    ], 'Board has proper transposed cells');
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
        },
      ],
      robotColors: ['red', 'blue'],
    });

    board.initializeRobots();

    const remainingColors = ['red', 'blue'];

    assert.equal(board.robots.length, 2, 'All robots are added to the board state.');

    board.robots.forEach((robot) => {
      const pos = robot.position;

      assert.ok(remainingColors.includes(robot.color), 'Robot has proper color.');
      remainingColors.removeObject(robot.color);

      assert.ok(pos.row >= 0 && pos.row <= 3, 'Robot row position is on the board.');
      assert.ok(pos.column >= 0 && pos.column <= 3, 'Robot column position is on the board.');
    });

    assert.equal(board.currentGoal, null, 'Initializing robots does not set current goal.');
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
      },
    ];
    const board = this.owner.lookup('service:store').createRecord('board', {
      cells: [
        [1, 4, 12, 3],
        [12, 7, 1, 3],
        [2, 2, 2, 4],
        [10, 1, 1, 6],
      ],
      goals,
      robotColors: ['red', 'blue'],
    });

    board.initializeRobots();
    board.setCurrentGoal(goals[1]);

    const { robots } = board;

    assert.deepEqual(board.currentGoal, goals[1], 'Board state has proper current goal.');
    assert.deepEqual(board.moves, [], 'Board state does not contain any moves.');
    assert.equal(board.selectedRobot, null, 'Board state has no selected robot.');
    assert.deepEqual(board.start, robots, 'Board state start equals robot colors / positions.');
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
      },
    ];
    const board = this.owner.lookup('service:store').createRecord('board', {
      cells: [
        [1, 4, 12, 3],
        [12, 7, 1, 3],
        [2, 2, 2, 4],
        [10, 1, 1, 6],
      ],
      goals,
      robotColors: ['red', 'blue'],
    });

    board.initializeRobots();
    board.setCurrentGoal(goals[0]);

    const robotOne = board.robots[0];
    const robotStartRow = robotOne.position.row;
    const robotStartColumn = robotOne.position.column;

    board.click(robotStartRow, robotStartColumn);

    assert.deepEqual(board.selectedRobot, robotOne, 'Robot is properly selected after click.');
    assert.equal(board.robots[0].position.row, robotStartRow, 'Robot did not move row after clicking it.');
    assert.equal(board.robots[0].position.column, robotStartColumn, 'Robot did not move column after clicking it.');
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
    });

    board.initializeRobots();
    board.setCurrentGoal({
      color: 'red',
      number: 2,
    });

    // Manually set the robot to a known position.
    const robotOne = board.robots[0];

    robotOne.position.row = 1;
    robotOne.position.column = 2;

    // Valid horizontal and vertical moves.
    assert.ok(board.canMoveToCell(1, 2, 0, 2), 'Robot can move up');
    assert.ok(board.canMoveToCell(1, 2, 1, 3), 'Robot can move right');
    assert.ok(board.canMoveToCell(1, 2, 3, 2), 'Robot can move down');
    assert.ok(board.canMoveToCell(1, 2, 1, 0), 'Robot can move left');

    // Try a few invalid horizontal and vertical moves.
    assert.notOk(board.canMoveToCell(1, 2, 2, 2), 'Robot can not move down to cell without borders.');
    assert.notOk(board.canMoveToCell(1, 2, 1, 1), 'Robot can not move left to cell without borders.');
  });
});
