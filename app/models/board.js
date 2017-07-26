import Ember from 'ember';
import Cell from 'ricochet-robots/models/cell';
import Robot from 'ricochet-robots/models/robot';

const {$} = Ember;

/**
 * Represents a board.
 */
export default Ember.Object.extend({
  /**
   * Board size.
   */
  size: null,

  /**
   * Board cells.
   */
  cells: [],

  /**
   * Robots.
   */
  robots: [],

  /**
   * Currently selected robot.
   */
  selectedRobot: null,

  /**
   * Three.js environment variables.
   */
  scene: null,
  camera: null,
  renderer: null,

  /**
   * Initializes the board and its cells.
   */
  initialize: function() {
    // Calculate the board dimensions.
    let scene = this.get('scene'),
      size = this.get('size');

    // Cells are simply one sixteenth of the board.
    let cellSize = size / 16;

    // Initialize all cells.
    for (let x = 0; x < 16; x ++) {
      for (let y = 0; y < 16; y++) {
        let cellX = (size / -2) + (x * cellSize) + (cellSize / 2),
          cellY = (size / -2) + (y * cellSize) + (cellSize / 2),
          cell = new Cell({
            size: cellSize,
            x: cellX,
            y: cellY,
            depth: -1000
          });
          this.get('cells').pushObject(cell);
          cell.initialize(scene);
      }
    }

    // Initialize the robots.
    let robot = new Robot({
      size: cellSize / 4
    });
    robot.initialize(scene);
    this.initializeRobotAtCell(robot, this.get('cells.0'));
    this.get('robots').pushObject(robot);
  },

  /**
   * Click handler for the board.
   * @param event
   */
  clicked: function(event) {
    let raycaster = new THREE.Raycaster(),
      mouse = new THREE.Vector2(),
      renderer = this.get('renderer'),
      camera = this.get('camera'),
      scene = this.get('scene'),
      that = this;

    // Account for the offset of the canvas.
    let offset = $('#board').offset(),
      leftOffset = offset.left,
      topOffset = offset.top;
    mouse.x = ((event.clientX - leftOffset) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ((event.clientY - topOffset) / renderer.domElement.clientHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let clickedObjects = raycaster.intersectObjects(scene.children),
      clickedCell = null,
      clickedRobot = null;

    // Find any clicked robot and/or cell.
    clickedObjects.forEach(function(clickedObject) {
      if (!clickedCell) {
        clickedCell = that.get('cells').find(function(cell) {
          return cell.get('mesh') === clickedObject.object;
        });
      }
      if (!clickedRobot) {
        clickedRobot = that.get('robots').find(function(robot) {
          return robot.get('mesh') === clickedObject.object;
        });
      }
    });

    // Set the current robot if necessary.
    if (clickedRobot) {
      this.set('selectedRobot', clickedRobot);
    }

    /**
     * See if we have to move the robot.
     */
    if (clickedCell && !clickedRobot && this.get('selectedRobot')) {
      this.moveRobotToCell(this.get('selectedRobot'), clickedCell);
    }
  },

  /**
   * Initializes the given robot at the given cell.
   * @param robot
   * @param cell
   */
  initializeRobotAtCell(robot, cell) {
    let x = cell.get('x'),
      y = cell.get('y');
    robot.setPosition(x, y);
  },

  /**
   * Moves the given robot to the given cell (if possible).
   * @param robot
   * @param cell
   */
  moveRobotToCell: function(robot, cell) {
    if (robot.get('x') === cell.get('x') || robot.get('y') === cell.get('y')) {
      this.initializeRobotAtCell(robot, cell);
    }
  }

});
