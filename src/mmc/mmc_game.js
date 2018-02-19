(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (MMC, undefined) { /* MMC (Mars Minig CO.) namespace */

  /**
   * The game object encompasses the entire game logic and state
   */
  JJ.MMC.Game = class Game extends JJ.BE.Game {
    /**
     * Constructor
     */
    constructor() {
      super()
    }

    /**
     * This is the primary game loop for the game
     */
    mainLoop(timestamp) {
      super.mainLoop(timestamp);
    }
  }

}(window.JJ.MMC = window.JJ.MMC || {}));
}(window.JJ = window.JJ || {}));