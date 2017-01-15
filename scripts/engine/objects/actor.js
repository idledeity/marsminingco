(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Objects, undefined) { /* Objects submodule namespace */

  // Actors are the common base entity for "real" objects that exist in the game world. All
  // actors maintain a world position, and most interact with the world in a non-trivial mannor.
  //
  Objects.Actor = class Actor extends Objects.Entity {
    constructor() {
      super();

      this.worldPos = new JJ.Math.Vector3(0.0, 0.0, 0.0);  // World position of the actor
    }

    // Per frame update
    update(deltaMs) {
      super.update(deltaMs);
    }

    // Returns the current world position of the actor
    getWorldPos() {
      return this.worldPos;
    }

    // Sets the world position of the actor
    setWorldPos(newPos) {
      // Ensure the new position is a valid vector3 object
      if (!JJ.System.assert((newPos instanceof JJ.Math.Vector3), "Position must be a Vector3.")) {
        return;
      }

      this.worldPos = newPos;
    }
  }

}(window.JJ.BE.Objects = window.JJ.BE.Objects || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));