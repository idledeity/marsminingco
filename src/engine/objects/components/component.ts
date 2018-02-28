import Entity from "../../objects/entity.js";

/**
 * Game entity component class is used to build modular entity functionality
 */
export default class Component {
  private parentEntity: Entity;

  /**
   * Constructor
   * @param {Entity} parentEntity - Parent entity this component belongs to
   */
  constructor(parentEntity: Entity) {
    this.parentEntity = null;    // Reference to the parent entity object that owns this component

    this.setParentEntity(parentEntity);
  }

  /**
   * Per frame update
   * @param {number} deltaMs - The elapsed time since the last update, in milliseconds
   */
  update(deltaMs: number) {
    // Nothing to do
  }

  /**
   * Sets the parent entity that 'owns' this component
   * @param {Entity} parentEntity - The parent entity that is gaining ownership of this component
   */
  setParentEntity(parentEntity: Entity) {
    this.parentEntity = parentEntity;
  }
}
