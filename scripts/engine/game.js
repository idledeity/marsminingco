(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */

  /**
   * The game class encompasses the entire game logic and state
   */
  JJ.BE.Game = class Game {
    /**
     * Constructor
     */
    constructor() {
      this.gameTimePrevMs = 0.0;
      this.gameTimeMs = 0.0;

      this.inputMgr = new BE.Input.InputManager();
      this.interfaceMgr = new BE.Interface.InterfaceManager();
      this.debugMgr = new BE.Debug.DebugManager(this);
      this.gameWorld = new BE.World();

    }

    /**
     * Returns the game's input manager
     * @return {JJ.BE.Input.InputManager} The game's input manager
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
     * @return {JJ.BE.Debug.DebugManager} The game's debug manager
     */
    getDebugMgr() {
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

}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));