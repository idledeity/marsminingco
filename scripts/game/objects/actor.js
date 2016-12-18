(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(Objects, undefined) { /* Objects submodule namespace */

    // Actors are the common base entity for "real" objects that exist in the game world. All
    // actors maintain a world position, and most interact with the world in a non-trivial mannor.
    //
    Objects.Actor = class Actor extends Objects.Entity {
      constructor() {
        super();

        var _worldPos = new MMC.Math.Vector3(0.0, 0.0, 0.0);

        this.worldPos = _worldPos;  // World position of the actor
      }

      // Per frame update
      update(deltaMs) {
        super.update(deltaMs);
      }

      // Returns the current world position of the actor
      get worldPos() {
        return worldPos;
      }

      // Sets the world position of the actor
      set worldPos(newPos) {
        worldPos = newPos;
      }
    }

  }(window.MMC.Objects = window.MMC.Objects || {}));
}(window.MMC = window.MMC || {}));