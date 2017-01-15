(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
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

}(window.JJ.BE.Objects = window.JJ.BE.Objects || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));