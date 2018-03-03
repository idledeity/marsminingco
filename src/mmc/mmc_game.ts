import Engine from"../engine/engine.js";
import Game from "../engine/game/game.js";
import { MMC } from "./mmc.js";

/**
 * The game object encompasses the entire game logic and state
 */
export default class MMCGame extends Game {
  private appMMC: MMC;
  
  /**
   * Constructor
   */
  constructor(appMMC: MMC) {
    super(appMMC);

    this.appMMC = appMMC;
  }

  /**
   * This is the primary game update for the game
   */
  update(deltaTimeMs: number) {
    super.update(deltaTimeMs);
  }
}
