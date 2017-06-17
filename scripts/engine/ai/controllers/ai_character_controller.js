 (function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(AI, undefined) { /* AI submodule namespace */

  /**
   * Class for controlling characters that are AI controlled
   */
  JJ.BE.AI.AICharacterController = class AICharacterController extends JJ.BE.Controllers.CharacterController {
    /**
     * Constructor
     */
    constructor() {
      super();
    }

    /**
     * Per frame update
     * @param {Number} deltaMs - The elapsed simulation time since the last time update was called, in milliseconds
     */
    update(deltaMs) {
      super.update(deltaMs);
    }
  }

}(window.JJ.BE.AI = window.JJ.BE.AI || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));