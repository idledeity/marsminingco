(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(Objects, undefined) { /* Objects submodule namespace */

    // Actors are the common base entity for "real" objects that exist in the game world. All
    // actors maintain a world position, and most interact with the world in a non-trivial mannor.
    //
    Objects.Actor = class Actor extends Objects.Entity {
      constructor() {
        super();

        this.worldPos = new MMC.Math.Vector3(0.0, 0.0, 0.0);  // World position of the actor
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
        if (!MMC.System.assert((newPos instanceof MMC.Math.Vector3), "Position must be a Vector3.")) {
          return;
        }

        this.worldPos = newPos;
      }
    }

  }(window.MMC.Objects = window.MMC.Objects || {}));
}(window.MMC = window.MMC || {}));