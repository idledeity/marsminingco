(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Interface, undefined) { /* Controllers submodule namespace */

  // The SerializedTypeManager class is a simple class that maintains a map of registered Serialized Types.
  //
  // The Serialize Type map is used to store type info necessary to restore serialized data into full fledged objects,
  // which cannot be deduced by normal means
  //
  Interface.InterfaceManager = class InterfaceManager {
    constructor() {
      this.panes = [];
    }

    // Main update
    //
    update(deltaTime) {
      // Update each of the panes
      for(let paneIndex = 0; paneIndex < this.panes.length; paneIndex++) {
        let currentPane = this.panes[paneIndex];
        currentPane.update(deltaTime);
      }
    }

    // Add a pane to the manager
    //
    addPane(pane) {
      this.panes.push(pane);
    }

    // Remove a pane from the manager
    //
    removePane(paneIndex) {
      this.panes.splice(paneIndex, 1);
    }
  }


}(window.JJ.BE.Interface = window.JJ.BE.Interface || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));