import Entity from "../objects/entity.js";

import Vector3 from "../../core_libs/math/vectors/vector3.js";
import assert from "../../core_libs/system/assert.js";

/**
 * Actors are the common base entity for "real" objects that exist in the game world. All
 * actors maintain a world position, and most interact with the world in a non-trivial mannor.
 * @extends Entity
 */
export default class Actor extends Entity {
  private worldPos: Vector3;  // World position of the actor

  /**
   * Constructor
   */
  constructor() {
    super();

    this.worldPos = Vector3.ZERO.copy();
  }

  /**
   * Per frame update
   * @param {number} deltaMs - The elapsed time since this last update, in milliseconds
   */
  update(deltaMs: number) {
    super.update(deltaMs);
  }

  /**
   * Returns the current world position of the actor
   */
  getWorldPos() {
    return this.worldPos.copy();
  }

  /**
   * Sets the world position of the actor
   * @param {Vector3} newPos = The new world position of the actor
   */
  setWorldPos(newPos: Vector3) {
    this.worldPos = newPos.copy();
  }
}
