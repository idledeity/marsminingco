import World from "../world/world.js";

import App from "../../core_libs/system/application/app";

export default class Game {
  private appMain: App;
  private gameWorld: World;

  private timePrevMs: number;
  private timeMs: number;

  /**
   * The game
   */
  constructor(appMain: App) {
    this.appMain = appMain;
    this.gameWorld = new World();

    this.timePrevMs = 0.0;
    this.timeMs = 0.0;
  }

  /**
   * Returns the world
   * @return {World} The world
   */
  getWorld() {
    return this.gameWorld;
  }

  /**
   * This is the primary update the engine
   * @param {number} deltaTimeMs - The elapsed time from that last update in milliseconds
   */
  update(deltaTimeMs: number) {
    // Update the game's time with the new timestamp
    this.timePrevMs = this.timeMs;
    this.timeMs = this.timeMs + deltaTimeMs;


    // Update the game world
    if (this.gameWorld != null) {
      this.gameWorld.update(deltaTimeMs);
    }
  }
}
