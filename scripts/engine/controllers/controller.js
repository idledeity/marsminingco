(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Controllers, undefined) { /* Controllers submodule namespace */

  /**
   * Base class for all object Controllers.
   *
   * Controllers are responsible for managing a world entity they are attached to.
   */
  JJ.BE.Controllers.Controller = class Controller {
    /**
     * Consturctor
     */
    constructor() {
      this.entity = null;  // Reference to the entity controlled by this controller
    }

    /**
     * Per frame update
     * @param {Number} deltaMs - The elapsed simulation time since the last time update was called, in milliseconds
     */
    update(deltaMs) {
      // Nothing to do
    }

    /**
     * Returns the entity controlled by this controller
     * @return {JJ.BE.Objects.Entity} The entity currently being controlled by this controller
     */
    getEntity() {
      return this.entity;
    }

    /**
     * Attach this controller to the entity specified
     * @param {JJ.BE.Objects.Entity} entity - The entity to be attached to this controller
     * @return {Boolean} True if the entity was successfully attached to this controller, False if there was an error
     */
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

      return true;
    }

    /**
     * Detach any attached entity from this controller
     */
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