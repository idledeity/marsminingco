(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */

  // The JJ world object manages the game's world and all the entities contained within it.
  JJ.BE.World = class World {
    constructor() {
      this.worldTimePrev = 0.0;   // Previous world time (MS)
      this.worldTime = 0.0;       // Current world time (MS)

      this.entities = [];         // Array of entites that exist in the world
      this.controllers = [];      // Array of controllers that exist in the world

      this.navNetwork = null;     // World navigation network for pathfinding
    }

    getWorldTime() {
      return this.worldTime;
    }

    getWorldTimePrev() {
      return this.worldTimePrev;
    }

    // Per frame processing for the game world
    update(deltaMs) {
      // Update the world time
      this.worldTimePrev = this.worldTime;
      this.worldTime += deltaMs;

      // First, update all of the controllers
      for (let controllerIndex = 0; controllerIndex < this.controllers.length; controllerIndex++) {
        this.controllers[controllerIndex].update(deltaMs);
      }

      // Update all of entities in the world
      for (let entityIndex = 0; entityIndex < this.entities.length; entityIndex++) {
        this.entities[entityIndex].update(deltaMs);
      }
    }

    // Returns the number of entities in the world
    getEntityCount() {
      return this.entities.length;
    }

    // Returns the entity at the specified index
    getEntityByIndex(index) {
      return this.entities[index];
    }

    // Adds an entity to the world
    addEntity(entity) {
      // Check the entity type
      if (!JJ.System.assert((entity instanceof JJ.BE.Objects.Entity), "Entity must be instance of JJ.BE.Objects.Entity.")) {
        return false;
      }

      // Push the new entity onto the end of the entities array
      this.entities.push(entity);
    }

    // Returns the number of controllers in the world
    getControllerCount() {
      return this.controllers.length;
    }

    // Returns the controller at the specified index
    getControllerByIndex(index) {
      return this.controllers[index];
    }

    // Adds a controller to the world
    addController(controller) {
      // Check the controller type
      if (!JJ.System.assert((controller instanceof JJ.BE.Controllers.Controller), "Controller must be instance of JJ.BE.Controllers.Controller.")) {
        return false;
      }

      // Push the new controller onto the end of the controllers array
      this.controllers.push(controller);
    }

    // Returns the navigation network for the world
    getNavNetwork() {
      return this.navNetwork;
    }

    // Set the world's navigation network
    setNavNetwork(navNetwork) {
      this.navNetwork = navNetwork;
    }
  }

}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));