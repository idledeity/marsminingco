import Entity from "../objects/entity.js";

import assert from "../../core_libs/system/assert.js";

/**
 * Base class for all object Controllers.
 *
 * Controllers are responsible for managing a world entity they are attached to.
 */
export default class Controller {
  private entity: Entity;

  /**
   * Consturctor
   */
  constructor() {
    this.entity = null;  // Reference to the entity controlled by this controller
  }

  /**
   * Per frame update
   * @param {number} deltaMs - The elapsed simulation time since the last time update was called, in milliseconds
   */
  update(deltaMs: number) {
    // Nothing to do
  }

  /**
   * Returns the entity controlled by this controller
   * @return {Entity} The entity currently being controlled by this controller
   */
  getEntity() {
    return this.entity;
  }

  /**
   * Attach this controller to the entity specified
   * @param {Entity} entity - The entity to be attached to this controller
   * @return {boolean} True if the entity was successfully attached to this controller, False if there was an error
   */
  attach(entity: Entity) {
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
      this.entity.setController(null);
    }

    // Clear the reference to the entity
    this.entity = null;
  }
}
