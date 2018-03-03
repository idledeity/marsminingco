import DebugManager from "./debug/debug_manager.js";
import InputManager from "./input/input_manager.js"
import InterfaceManager from "./interface/interface_manager.js";

/**
 * The engine class encompasses the entire game engine logic and state
 */
export default class Engine {
  private inputMgr: InputManager;
  private interfaceMgr: InterfaceManager;
  private debugMgr: DebugManager;

  /**
   * Constructor
   */
  constructor() {
    this.inputMgr = new InputManager();
    this.interfaceMgr = new InterfaceManager();
    this.debugMgr = new DebugManager(this);
  }

  /**
   * Returns the input manager
   * @return {InputManager} The game's input manager
   */
  getInputMgr() {
    return this.inputMgr;
  }

  /**
   * Returns the interface manager
   * @return {InterfaceManager} The game's interface manager
   */
  getInterfaceMgr() {
    return this.interfaceMgr;
  }

  /**
   * Returns the debug manager
   * @return {DebugManager} The game's debug manager
   */
  getDebugMgr(): DebugManager {
    return this.debugMgr;
  }

  /**
   * This is the primary update the engine
   * @param {number} deltaTimeMs - The elapsed time from that last update in milliseconds
   */
  update(deltaTimeMs: number) {
    // Update the input manager
    if (this.inputMgr != null) {
      this.inputMgr.update();
    }

    // Update the debug manager
    if (this.debugMgr != null) {
      this.debugMgr.update(deltaTimeMs);
    }

    // Update the interface manager
    if (this.interfaceMgr != null) {
      this.interfaceMgr.update(deltaTimeMs);
    }
  }
}

