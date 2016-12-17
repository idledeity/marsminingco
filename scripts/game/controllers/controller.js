(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(Controllers, undefined) { /* Controllers submodule namespace */

    Controllers.Controller = class Controller {
      constructor(entity) {
        var _entity = entity;

        this.entity = _entity;  // Reference to the entity controlled by this controller
      }

      // Per frame update
      update(deltaMs) {
        // Nothing to do
      }

      get entity() { 
        return this.entity;
      }
      
      set entity(newEntity) { 
        this.entity = newEntity;
      }
    }

  }(window.MMC.Controllers = window.MMC.Controllers || {}));
}(window.MMC = window.MMC || {}));