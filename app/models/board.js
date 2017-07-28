import Ember from 'ember';
import BoardLayout from 'ricochet-robots/models/board-layout';
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

    // Initialize the layout
    let layout = new BoardLayout({
      scene: scene,
      size: size
    });
    this.set('cells', layout.getCells());

    // Initialize the robots.
    let robot = new Robot({
      // Cells are one-sixteenth the size of the board and robots
      // are one-fourth the size of the cell.
      size: (size / 16) / 4
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
    let robotX = robot.get('x'),
      robotY = robot.get('y'),
      cellX = cell.get('x'),
      cellY = cell.get('y');
    if (robotX === cellX) {
      this.initializeRobotAtCell(robot, cell);
    }

    if (robotY === cellY) {
      this.initializeRobotAtCell(robot, cell);
    }
  }

});
