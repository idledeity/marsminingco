(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Interface, undefined) { /* Interface submodule namespace */

  /**
   * The InterfaceManager class is responsible for managing all interface panes and processes user input
   */
  JJ.BE.Interface.InterfaceManager = class InterfaceManager {
    /**
     * Constructor
     */
    constructor() {
      this.panes = [];
    }

    /**
     * Main update
     * @param {Number} deltaMs - Elapsed time since the last time update was called, in milliseconds
     */
    update(deltaMs) {
      // Update each of the panes
      for(let paneIndex = 0; paneIndex < this.panes.length; paneIndex++) {
        let currentPane = this.panes[paneIndex];
        currentPane.update(deltaTime);
      }
    }

    /**
     * Add a pane to the manager
     * @param {JJ.BE.Interface.UIPane} pane - The pane being added to the Interface manager
     */
    addPane(pane) {
      this.panes.push(pane);
    }

    /**
     * Remove a pane from the manager
     * @param {Number} paneIndex - The index of the pane to be removed
     */
    removePane(paneIndex) {
      this.panes.splice(paneIndex, 1);
    }
  }


}(window.JJ.BE.Interface = window.JJ.BE.Interface || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));