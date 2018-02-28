import DebugManager from "./debug/debug_manager.js";
import InputManager from "./input/input_manager.js"
import InterfaceManager from "./interface/interface_manager.js";
import World from "./world/world.js";

/**
 * The game class encompasses the entire game logic and state
 */
export default class Game {
  private gameTimePrevMs: number;
  private gameTimeMs: number;
  private inputMgr: InputManager;
  private interfaceMgr: InterfaceManager;
  private debugMgr: DebugManager;
  private gameWorld: World;

  /**
   * Constructor
   */
  constructor() {
    this.gameTimePrevMs = 0.0;
    this.gameTimeMs = 0.0;
    this.inputMgr = new InputManager();
    this.interfaceMgr = new InterfaceManager();
    this.debugMgr = new DebugManager(this);
    this.gameWorld = new World();

  }

  /**
   * Returns the game's input manager
   * @return {InputManager} The game's input manager
   */
  getInputMgr() {
    return this.inputMgr;
  }

  /**
   * Returns the game's interface manager
   * @return {JJ.BE.Interface.InterfaceManager} The game's interface manager
   */
  getInterfaceMgr() {
    return this.interfaceMgr;
  }

  /**
   * Returns the game's debug manager
   * @return {DebugManager} The game's debug manager
   */
  getDebugMgr(): DebugManager {
    return this.debugMgr;
  }

  /**
   * Returns the game world
   * @return {JJ.BE.World} The game world
   */
  getWorld() {
    return this.gameWorld;
  }

  /**
   * This is the primary game loop for the game
   * @param {Number} timestamp - The current system timestamp for the elapsed number of milliseconds
   */
  mainLoop(timestamp) {
    // Update the game's time with the new timestamp
    this.gameTimePrevMs = this.gameTimeMs;
    this.gameTimeMs = timestamp;
    const deltaTime = this.gameTimeMs - this.gameTimePrevMs;

    // Update the input manager
    if (this.inputMgr != null) {
      this.inputMgr.update();
    }

    // Update the debug manager
    if (this.debugMgr != null) {
      this.debugMgr.update(deltaTime);
    }

    // Update the game world
    if (this.gameWorld != null) {
      this.gameWorld.update(deltaTime);
    }

    // Update the interface manager
    if (this.interfaceMgr != null) {
      this.interfaceMgr.update(deltaTime);
    }

    // Request the main loop to be called again after the browser has rendered the window
    requestAnimationFrame(this.mainLoop.bind(this));
  }

  /**
   * This is the primary entry point for the game, initiating the main game loop
   */
  runGame() {
    requestAnimationFrame(this.mainLoop.bind(this));
  }
}

