(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */

  /**
   * The JJ world object manages the game's world and all the entities contained within it.
   */
  JJ.BE.World = class World {
    /**
     * Constructor
     */
    constructor() {
      this.worldTimePrev = 0.0;   // Previous world time (MS)
      this.worldTime = 0.0;       // Current world time (MS)

      this.entities = [];         // Array of entites that exist in the world
      this.controllers = [];      // Array of controllers that exist in the world

      this.navNetwork = null;     // World navigation network for pathfinding
    }

    /**
     * Returns the current elapsed time of the world, in milliseconds
     * @return {Number} The currenty elapsed time since the start of the world, in milliseconds
     */
    getWorldTime() {
      return this.worldTime;
    }

    /**
     * Returns the previous elapsed time of the world from the last frame, in milliseconds
     * @return {Number} The elapsed world time from the previous frame, in milliseconds
     */
    getWorldTimePrev() {
      return this.worldTimePrev;
    }

    /**
     * Per frame processing for the game world
     * @param {Number} deltaMs - The amount of time to step the world simulation, in milliseconds
     */
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

    /**
     * Returns the number of entities in the world
     * @return {Number} The number of entities currently managed by the world
     */
    getEntityCount() {
      return this.entities.length;
    }

    /**
     * Returns the entity at the specified index
     * @param {Number} - The index of the entity to retrieve
     * @return {JJ.BE.Objects.Entity} The entity at the specified index, or (null) if no entity is at the given index
     */
    getEntityByIndex(index) {
      return this.entities[index];
    }

    /**
     * Adds an entity to the world
     * @param {JJ.BE.Objects.Entity} entity - The entity to add to the world
     * @return {Boolean} True if the entity was successfully added to the world, False if there was an error
     */
    addEntity(entity) {
      // Check the entity type
      if (!JJ.System.assert((entity instanceof JJ.BE.Objects.Entity), "Entity must be instance of JJ.BE.Objects.Entity.")) {
        return false;
      }

      // Push the new entity onto the end of the entities array
      this.entities.push(entity);
    }

    /**
     * Returns the number of controllers in the world
     * @return {Number} The number of controllers currently manaed by the world
     */
    getControllerCount() {
      return this.controllers.length;
    }

    /**
     * Returns the controller at the specified index
     * @param {Number} index - The index of the controller to retrieve
     * @return {JJ.BE.Controllers.Controller} The controller at the specified index, or (null) if no controller exists
     *    at the requested index
     */
    getControllerByIndex(index) {
      return this.controllers[index];
    }

    /**
     * Adds a controller to the world
     * @param {JJ.BE.Controllers.Controller} controller - The controller to add to the world
     * @return {Boolean} True if the controller was successfully added to the world, False if there was an error
     */
    addController(controller) {
      // Check the controller type
      if (!JJ.System.assert((controller instanceof JJ.BE.Controllers.Controller), "Controller must be instance of JJ.BE.Controllers.Controller.")) {
        return false;
      }

      // Push the new controller onto the end of the controllers array
      this.controllers.push(controller);
    }

    /**
     * Returns the navigation network for the world
     * @return {JJ.BE.AI.Pathfinding.NavNetwork} The root navigation network for the world
     */
    getNavNetwork() {
      return this.navNetwork;
    }

    /**
     * Set the world's navigation network
     * @param {JJ.BE.AI.Pathfinding.NavNetwork} navNetwork - The new root navigation network for the world
     */
    setNavNetwork(navNetwork) {
      this.navNetwork = navNetwork;
    }
  }

}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));