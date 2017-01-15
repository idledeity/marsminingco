(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(AI, undefined) { /* AI submodule namespace */

  AI.AICharacterController = class AICharacterController extends JJ.BE.Controllers.CharacterController {
    constructor() {
      super();
    }

    // Per frame update
    update(deltaMs) {
      super.update(deltaMs);
    }
  }

}(window.JJ.BE.AI = window.JJ.BE.AI || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));