(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  // The game object encompasses the entire game logic and state
  MMC.Game = class Game {
    constructor() {
      this.gameTimePrevMs = 0.0;
      this.gameTimeMs = 0.0;

      this.gameWorld = new MMC.World();
    }

    // This is the primary game loop for the game
    mainLoop(timestamp) {
      // Update the game's time with the new timestamp
      this.gameTimePrevMs = this.gameTimeMs;
      this.gameTimeMs = timestamp;
      const deltaTime = this.gameTimeMs - this.gameTimePrevMs;

      // Update the game world
      if (this.gameWorld != null) {
        this.gameWorld.update(deltaTime);
      }

      // Request the main loop to be called again after the browser has rendered the window
      requestAnimationFrame(this.mainLoop.bind(this));
    }

    // This is the primary entry point for the game, initiating the main game loop
    runGame() {
      requestAnimationFrame(this.mainLoop.bind(this));
    }
  }

}(window.MMC = window.MMC || {}));