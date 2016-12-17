(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(AI, undefined) { /* AI submodule namespace */

    AI.AICharacterController = class AICharacterController extends MMC.Controllers.CharacterController {
      constructor() {
        super();
      }

      // Per frame update
      update(deltaMs) {
        super.update(deltaMs);
      }
    }

  }(window.MMC.AI = window.MMC.AI || {}));
}(window.MMC = window.MMC || {}));