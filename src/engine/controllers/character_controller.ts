
import Controller from "./controller.js";

import Character from "../objects/characters/character.js";

import Vector3 from "../../core_libs/math/vectors/vector3.js";
import assert from "../../core_libs/system/assert.js";

/**
 * Character controller manages the interactions of a character entity in the world
 * @extends Controller
 */
export default class CharacterController extends Controller {
  private moveDir: Vector3;   // Character movement direction
  private moveSpeed: number;  // Character movement speed

  /**
   * Constructor
   */
  constructor() {
    super();

    this.moveDir = Vector3.FORWARD.copy();
    this.moveSpeed = 0.0;
  }

  /**
   * Returns the character's movement direction
   * @return {Vector3} The current movement direction of the character
   */
  getMoveDir() {
    return this.moveDir.copy();
  }

  /**
   * Set the character's movement direction
   * @param {Vector3} vector - The new character movement direction
   */
  setMoveDir(vector: Vector3) {
    if (!assert(this.moveDir.isNormalized(), "Character movement direction must be a unit vector.")) {
      return;
    }

    this.moveDir.equals(vector);
  }

  /**
   * Returns the character's movement speed
   * @return {number} The current movement speed of the character
   */
  getMoveSpeed() {
    return this.moveSpeed;
  }

  /**
   * Set the character's movement speed
   * @param {number} speed - The new movevment speed to set on the character
   */
  setMoveSpeed(speed: number) {
    this.moveSpeed = speed;
  }

  getCharacter() {
    return (this.getEntity() as Character);
  }

  /**
   * Per frame update function
   * @param {number} deltaMs - The elapsed simulation time since the last time update was called, in milliseconds
   */
  update(deltaMs: number) {
    super.update(deltaMs);

    // Update the character
    let character = this.getCharacter();
    if (character != null) {
      const deltaSeconds = deltaMs / 1000.0;

      // Update the character's position
      const currentWorldPos = character.getWorldPos();
      const displacement = this.moveSpeed * deltaSeconds;
      const newWorldPos = this.moveDir.copy().scalarMul(displacement).add(currentWorldPos);

      character.setWorldPos(newWorldPos);
    }
  }
}
