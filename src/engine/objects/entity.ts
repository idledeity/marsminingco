import Component from "./components/component.js";
import Controller from "../controllers/controller.js";
import World from "../world/world.js"

import assert from "../../core_libs/system/assert.js";

/**
 * Game entities are the common base class for all game "objects" that exist in the world, allthough they
 * may be entirely abstract. Each entity maintains a list of components, which provide modular funcitonality
 * to the entities.
 */
export default class Entity {
  private world: World;             // Reference to the world this entity belongs to
  private components: Component[];  // Array of components managed by this entity
  private controller: Controller;   // The controller for this entity
  
  /**
   * Constructor
   */
  constructor() {
    this.world = null;
    this.components = [];
    this.controller = null;
  }

  /**
   * Per frame update
   * @param {number} deltaMs - The elapsed time since the last update, in milliseconds
   */
  update(deltaMs: number) {
    // Update each of the components
    for (let currentComponent of this.components) {
      currentComponent.update(deltaMs);
    }
  }

  /**
   * Returns the current number of components attached to this entity
   * @return {number} The number of components attached to this entity
   */
  getComponentCount() {
    return this.components.length;
  }

  /**
   * Returns the component at the specified index
   * @param {number} index - The index of the component attached to this entity to retrieve
   * @return {Component} The component at the specified inde
   */
  getComponentByIndex(index: number): Component {
    return this.components[index];
  }

  /**
   * Checks if the passed component is owned by this entity
   * @param {Component} component - The component to check if is owned by this entity
   * @return {boolean} True if the passed component is owned by this entity, False if it is not
   */
  ownsComponent(component: Component) {
    // Loop over components looking for any matches
    for (let currentComponent of this.components) {
      if (currentComponent === component) {
        return true;
      }
    }

    return false;
  }

  /**
   * Attaches the passed component to this entity
   * @param {Component} component - The component to attach to this entity
   */
  attachComponent(component: Component) {
    // Set the component's parent to this entity
    component.setParentEntity(this);

    // Push the new component onto the end of the components array
    this.components.push(component);
  }

  /**
   * Removes the component at the specified index
   * @param {number} index - The index of the component to detach from this entity
   */
  detachComponentByIndex(index: number) {
    // First get the component at the specified index
    let component = this.getComponentByIndex(index);
    if (component != null) {
      // Clear the component's parent entity
      component.setParentEntity(null);
    }

    // Remove the component from the array of components
    this.components.splice(index, 1);
  }

  /**
   * Returns the controller attached to this entity (if any)
   * @return {Controller} The controller that is attached to this entity (if any)
   */
  getController() {
    return this.controller;
  }

  /**
   * Set the controller attached to this entity
   * @param {Controller} controller - The new controller that controls this entity
   * @return {boolean} True if the controller gained control over this entity, False if there was an error
   */
  setController(controller: Controller) {
    this.controller = controller;
    return true;
  }
}
