import MMCGame from "./mmc_game.js";

import App from "../core_libs/system/application/app.js";
import Engine from "../engine/engine.js";

export class MMC extends App {
  private engine: Engine;
  private game: MMCGame;
  
  /**
   * Constructor
   */
  constructor() {
    super();

    this.engine = new Engine;
    this.game = new MMCGame(this);
  }

  /**
   * Per-frame updating
   * @param deltaTimeMs - the elapsed time in MS since the last time update was called 
   */
  update(deltaTimeMs: number) {
    // Update the engine
    this.engine.update(deltaTimeMs);
  }
}

// Create the MMC app and start running it
let MarsMiningCompany = new MMC();
MarsMiningCompany.runApp();
