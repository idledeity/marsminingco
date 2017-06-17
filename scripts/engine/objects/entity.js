(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Objects, undefined) { /* Objects submodule namespace */

  /**
   * Game entities are the common base class for all game "objects" that exist in the world, allthough they
   * may be entirely abstract. Each entity maintains a list of components, which provide modular funcitonality
   * to the entities.
   */
  JJ.BE.Objects.Entity = class Entity {
    /**
     * Constructor
     */
    constructor() {
      var _world = null;
      var _components = [];

      this.world = _world;            // Reference to the world this entity belongs to

      this.components = _components;  // Array of components managed by this entity
      this.controller = null;
    }

    /**
     * Per frame update
     * @param {Number} deltaMs - The elapsed time since the last update, in milliseconds
     */
    update(deltaMs) {
      // Update each of the components
      for (let currentComponent in this.components) {
        currentComponent.update(deltaMs);
      }
    }

    /**
     * Returns the current number of components attached to this entity
     * @return {Number} The number of components attached to this entity
     */
    getComponentCount() {
      return this.components.length;
    }

    /**
     * Returns the component at the specified index
     * @param {Number} index - The index of the component attached to this entity to retrieve
     * @return {JJ.BE.Objects.Component} The component at the specified inde
     */
    getComponentByIndex(index) {
      return this.components[index];
    }

    /**
     * Checks if the passed component is owned by this entity
     * @param {JJ.BE.Objects.Component} component - The component to check if is owned by this entity
     * @return {Boolean} True if the passed component is owned by this entity, False if it is not
     */
    ownsComponent(component) {
      // Loop over components looking for any matches
      for (let currentComponent in this.components) {
        if (currentComponent === component) {
          return true;
        }
      }

      return false;
    }

    /**
     * Attaches the passed component to this entity
     * @param {JJ.BE.Objects.Component} component - The component to attach to this entity
     */
    attachComponent(component) {
      // Set the component's parent to this entity
      component.setParentEntity(this);

      // Push the new component onto the end of the components array
      this.components.push(component);
    }

    /**
     * Removes the component at the specified index
     * @param {Number} index - The index of the component to detach from this entity
     */
    detachComponentByIndex(index) {
      // First get the component at the specified index
      let component = getComponentByIndex(index);
      if (component != null) {
        // Clear the component's parent entity
        component.setParentEntity(null);
      }

      // Remove the component from the array of components
      this.components.splice(index, 1);
    }

    /**
     * Returns the controller attached to this entity (if any)
     * @return {JJ.BE.Controllers.Controller} The controller that is attached to this entity (if any)
     */
    getController() {
      return this.controller;
    }

    /**
     * Set the controller attached to this entity
     * @param {JJ.BE.Controllers.Controller} controller - The new controller that controls this entity
     * @return {Boolean} True if the controller gained control over this entity, False if there was an error
     */
    setController(controller) {
      // Check the controller type
      if (!JJ.System.assert(((controller == null) || (controller instanceof JJ.BE.Controllers.Controller)),
        "Controller must be an instance of JJ.BE.Controllers.Controller.")) {
        return false;
      }

      this.controller = controller;
      return true;
    }
  }

}(window.JJ.BE.Objects = window.JJ.BE.Objects || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));