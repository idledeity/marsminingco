(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Controllers, undefined) { /* Controllers submodule namespace */

  // Base class for all world Controller.
  //
  // Controllers are responsible for managing a world entity they are attached to.
  //
  Controllers.Controller = class Controller {
    constructor() {
      this.entity = null;  // Reference to the entity controlled by this controller
    }

    // Per frame update
    update(deltaMs) {
      // Nothing to do
    }

    // Returns the entity controlled by this controller
    getEntity() {
      return this.entity;
    }

    // Attach this controller to the entity specified
    attach(entity) {
      // Check the entity type
      if (!JJ.System.assert((entity instanceof JJ.BE.Objects.Entity),
        "Controllers can only attach to instances of JJ.BE.Objects.Entity.")) {
        return false;
      }

      // Check if the entity is already attached to a controller
      let entityController = entity.getController();
      if (entityController != null) {
        // Detach the controller
        entityController.detach();
      }

      // Attach the controller to the entity
      entity.setController(this);
      this.entity = entity;
    }

    // Detach this controller from any attached entity
    detach() {
      // Update the entity if currently attached to one
      if (this.entity != null) {
        this.entity.SetController(null);
      }

      // Clear the reference to the entity
      this.entity = null;
    }
  }

}(window.JJ.BE.Controllers = window.JJ.BE.Controllers || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));