(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(Objects, undefined) { /* Objects submodule namespace */

    // Game entity component class is used to build modular entity functionality
    Objects.Component = class Component {
      constructor(parentEntity) {
        var _parentEntity = null;

        this.parentEntity = _parentEntity;    // Reference to the parent entity object that owns this component

        setParentEntity(parentEntity);
      }

      // Per frame update
      update(deltaMs) {

      }

      // Sets the parent entity that 'owns' this component
      setParentEntity(parentEntity) {
        this.parentEntity = parentEntity;
      }
    }

  }(window.MMC.Objects = window.MMC.Objects || {}));
}(window.MMC = window.MMC || {}));