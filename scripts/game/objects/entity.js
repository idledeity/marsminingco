(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(Objects, undefined) { /* Objects submodule namespace */

    //
    // Game entities are the common base class for all game "objects" that exist in the world, allthough they
    // may be entirely abstract. Each entity maintains a list of components, which provide modular funcitonality
    // to the entities.
    //
    Objects.Entity = class Entity {
      constructor() {
        var _world = null;
        var _components = [];

        this.world = _world;            // Reference to the world this entity belongs to
        this.components = _components;  // Array of components managed by this entity
      }

      // Per frame update
      update(deltaMs) {
        // Update each of the components
        for (let currentComponent in this.components) {
          currentComponent.update(deltaMs);
        }
      }

      // Returns the current number of components attached to this entity
      getComponentCount() {
        return this.components.length;
      }

      // Returns the component at the specified index
      getComponentByIndex(index) {
        return this.components[index];
      }

      // Returns whether the passed component is part of this entity's component list
      ownsComponent(component) {
        // Loop over components looking for any matches
        for (let currentComponent in this.components) {
          if (currentComponent === component) {
            return true;
          }
        }

        return false;
      }

      // Attaches the passed component to this entity
      addComponent(component) {
        // Set the component's parent to this entity
        component.setParentEntity(this);

        // Push the new component onto the end of the components array
        this.components.push(component);
      }

      // Removes the component at the specified index
      removeComponentByIndex(index) {
        // First get the component at the specified index
        let component = getComponentByIndex(index);
        if (component != null) {
          // Clear the component's parent entity
          component.setParentEntity(null);
        }

        // Remove the component from the array of components
        this.components.splice(index, 1);
      }
    }

  }(window.MMC.Objects = window.MMC.Objects || {}));
}(window.MMC = window.MMC || {}));