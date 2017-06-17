(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Controllers, undefined) { /* Controllers submodule namespace */

  /**
   * Character controller manages the interactions of a character entity in the world
   * @extends JJ.BE.Controllers.Controller
   */
  JJ.BE.Controllers.CharacterController = class CharacterController extends Controllers.Controller {
    /**
     * Constructor
     */
    constructor() {
      super();

      this.moveDir = new JJ.Math.Vector3(JJ.Math.vector2Forward); // Character movement direction
      this.moveSpeed = 0.0;                                         // Character movement speed
    }

    /**
     * Returns the character's movement direction
     * @return {JJ.Math.Vector3} The current movement direction of the character
     */
    getMoveDir() {
      return this.moveDir;
    }

    /**
     * Set the character's movement direction
     * @param {JJ.Math.Vector3} vector - The new character movement direction
     */
    setMoveDir(vector) {
      if (!JJ.System.assert(this.moveDir.isNormalized(), "Character movement direction must be a unit vector.")) {
        return;
      }

      this.moveDir.equals(vector);
    }

    /**
     * Returns the character's movement speed
     * @return {Number} The current movement speed of the character
     */
    getMoveSpeed() {
      return this.moveSpeed;
    }

    /**
     * Set the character's movement speed
     * @param {Number} speed - The new movevment speed to set on the character
     */
    setMoveSpeed(speed) {
      this.moveSpeed = speed;
    }

    /**
     * Per frame update function
     * @param {Number} deltaMs - The elapsed simulation time since the last time update was called, in milliseconds
     */
    update(deltaMs) {
      super.update(deltaMs);

      // Update the character
      let character = this.getEntity();
      if (character != null) {
        const deltaSeconds = deltaMs / 1000.0;

        // Update the character's position
        const currentWorldPos = character.getWorldPos();
        const displacement = this.moveSpeed * deltaSeconds;
        const worldPos = this.moveDir.copy().scalarMul(displacement).add(currentWorldPos);

        character.setWorldPos(worldPos);
      }
    }
  }

}(window.JJ.BE.Controllers = window.JJ.BE.Controllers || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));