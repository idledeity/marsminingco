(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(Objects, undefined) { /* Objects submodule namespace */

    // Characters are the common class for all Actors that support behaviors
    //
    Objects.Character = class Character extends Objects.Actor {
      constructor() {
        // Call the super constructor
        super();
      }

      // Per frame update
      update(deltaMs) {
        super.update(deltaMs);
      }

    }

  }(window.MMC.Objects = window.MMC.Objects || {}));
}(window.MMC = window.MMC || {}));