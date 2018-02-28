import NavNetwork from "../ai/pathfinding/nav_network/nav_network.js";
import Controller from "../controllers/controller.js";
import Entity from "../objects/entity.js";

import assert from "../../core_libs/system/assert.js";

/**
 * The JJ world object manages the game's world and all the entities contained within it.
 */
export default class World {
  private worldTimePrev: number;      // Previous world time (MS)
  private worldTime: number;          // Current world time (MS)
  private entities: Entity[];         // Array of entites that exist in the world
  private controllers: Controller[];  // Array of controllers that exist in the world
  private navNetwork: NavNetwork;     // World navigation network for pathfinding

  /**
   * Constructor
   */
  constructor() {
    this.worldTimePrev = 0.0;   
    this.worldTime = 0.0;       
    this.entities = [];         
    this.controllers = [];      
    this.navNetwork = null;     
  }

  /**
   * Returns the current elapsed time of the world, in milliseconds
   * @return {number} The currenty elapsed time since the start of the world, in milliseconds
   */
  getWorldTime() {
    return this.worldTime;
  }

  /**
   * Returns the previous elapsed time of the world from the last frame, in milliseconds
   * @return {number} The elapsed world time from the previous frame, in milliseconds
   */
  getWorldTimePrev() {
    return this.worldTimePrev;
  }

  /**
   * Per frame processing for the game world
   * @param {number} deltaMs - The amount of time to step the world simulation, in milliseconds
   */
  update(deltaMs: number) {
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
   * @return {number} The number of entities currently managed by the world
   */
  getEntityCount() {
    return this.entities.length;
  }

  /**
   * Returns the entity at the specified index
   * @param {number} - The index of the entity to retrieve
   * @return {Entity} The entity at the specified index, or (null) if no entity is at the given index
   */
  getEntityByIndex(index: number) {
    return this.entities[index];
  }

  /**
   * Adds an entity to the world
   * @param {Entity} entity - The entity to add to the world
   * @return {Boolean} True if the entity was successfully added to the world, False if there was an error
   */
  addEntity(entity: Entity) {
    // Push the new entity onto the end of the entities array
    this.entities.push(entity);
  }

  /**
   * Returns the number of controllers in the world
   * @return {number} The number of controllers currently manaed by the world
   */
  getControllerCount() {
    return this.controllers.length;
  }

  /**
   * Returns the controller at the specified index
   * @param {Number} index - The index of the controller to retrieve
   * @return {Controller} The controller at the specified index, or (null) if no controller exists
   *    at the requested index
   */
  getControllerByIndex(index) {
    return this.controllers[index];
  }

  /**
   * Adds a controller to the world
   * @param {Controller} controller - The controller to add to the world
   * @return {boolean} True if the controller was successfully added to the world, False if there was an error
   */
  addController(controller: Controller) {
    // Push the new controller onto the end of the controllers array
    this.controllers.push(controller);
  }

  /**
   * Returns the navigation network for the world
   * @return {NavNetwork} The root navigation network for the world
   */
  getNavNetwork() {
    return this.navNetwork;
  }

  /**
   * Set the world's navigation network
   * @param {NavNetwork} navNetwork - The new root navigation network for the world
   */
  setNavNetwork(navNetwork: NavNetwork) {
    this.navNetwork = navNetwork;
  }
}
