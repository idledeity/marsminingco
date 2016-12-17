(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(Controllers, undefined) { /* Controllers submodule namespace */

    Controllers.CharacterController = class CharacterController extends Controllers.Controller {
      constructor() {
        super();
      }

      // Per frame update
      update(deltaMs) {
        super.update(deltaMs);
      }
    }

  }(window.MMC.Controllers = window.MMC.Controllers || {}));
}(window.MMC = window.MMC || {}));