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
    robot.setPosition(this.get('cells.0'));
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
   * Moves the given robot to the given cell (if possible).
   * @param robot
   * @param targetCell
   */
  moveRobotToCell: function(robot, targetCell) {
    let robotCell = robot.get('currentCell'),
      traversingCells = [],
      robotNr = robotCell.get('number'),
      targetNr = targetCell.get('number'),
      clearPath = false;

    // Robot and target cell are on the same horizontal
    // line.
    if (Math.abs(robotNr - targetNr) % 16 === 0 && robotCell.get('number') !== targetCell.get('number')) {
      traversingCells = this.get('cells').filter(function(cell) {
        return (cell.get('number') - robotCell.get('number')) % 16 === 0 && cell.get('number') < targetCell.get('number');
      });

      // User wants to move the robot to the right.
      if (robotCell.get('number') < targetCell.get('number')) {
        if (!robotCell.get('hasRightWall')) {
          clearPath = traversingCells.every(function(cell) {
            return !cell.get('hasRightWall');
          });
        }
      } else {
        if (!robotCell.get('hasLeftWall')) {
          clearPath = traversingCells.every(function(cell) {
            return !cell.get('hasLeftWall');
          });
        }
      }
      if (clearPath) {
        robot.setPosition(targetCell);
      }
    }
  },

});
