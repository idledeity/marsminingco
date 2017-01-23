(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Debug, undefined) { /* Debug submodule namespace */

  // The DebugManager manages all debug functionality and rendering
  //
  Debug.DebugManager = class DebugManager {
    constructor(game) {
      this.game = game;

      // Create the debug console and add it to the interface manager
      this.consolePane = new BE.Interface.Panes.Console(document.getElementById('game'));
      this.game.getInterfaceMgr().addPane(this.consolePane);
    }

    // Main update
    //
    update(deltaTime) {
      // If the tilda key was pressed, toggle the console visibility
      let inputMgr = this.game.getInputMgr();
      if (inputMgr.getKeyDown(JJ.System.IO.Keyboard.KeyCodesEnum.KEY_TILDA)) {
        this.consolePane.toggleVisiblity();
      }
    }
  }


}(window.JJ.BE.Debug = window.JJ.BE.Debug || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));