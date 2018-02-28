import Actor from "../actor.js"

/**
 * Characters are the common class for all Actors that support behaviors
 * @extends Actor
 */
export default class Character extends Actor {
  /**
   * Constructor
   */
  constructor() {
    // Call the super constructor
    super();
  }

  /**
   * Per frame update
   * @param {number} deltaMs - Elapsed time since the last update, in milliseconds
   */
  update(deltaMs: number) {
    super.update(deltaMs);
  }

}
