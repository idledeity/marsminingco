(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(AI, undefined) { /* AI submodule namespace */
(function(Pathfinding, undefined) { /* Behavior submodule namespace */

  /**
   * The NavNetworkNode class represents a node in the NavMeshNetwork.
   * @extends JJ.Containers.MeshNetworkNode
   */
  JJ.BE.AI.Pathfinding.NavNetworkNode = class NavNetworkNode extends JJ.Containers.MeshNetworkNode {
    /**
     * Constructor
     * @param {JJ.Math.Vector3} worldPos - The world position of the nav network node in world space
     */
    constructor(worldPos) {
      // Call the super
      super();

      // Store a copy of the world position
      this.worldPos = new JJ.Math.Vector3(worldPos);   // Position of the navigation node in world space
    }

    /**
     * Returns the world position of the navigation node
     * @return {JJ.Math.Vector3} The world position of the navigation node in world space
     */
    getWorldPos() {
      return this.worldPos;
    }

    /**
     * Sets the world position of the navigation node
     * @param {JJ.Math.Vector3} worldPos - The new world position of the navigation node in world space
     */
    setWorldPos(worldPos) {
      this.worldPos = worldPos;
    }

    //
    // Serializable methods
    //

    /**
     * Returns the serialization ID for the object
     * @return {String} Unique serialization ID for this class
     */
    static getSerializationId() {
      return "NavNetworkNode";
    }

    /**
     * Serializes this object to and from a buffer
     * @param {Object} serializeContext - The serialization context for the current operations (ex. read or write)
     */
    serialize(serializeContext) {
      super.serialize(serializeContext);

      this.worldPos = JJ.System.Serialization.serialize(serializeContext, this.worldPos, "worldPos");
    }
  }

  // Register this serializable type with the serialization type manager
  JJ.System.Serialization.serializableTypeMgr.registerType(Pathfinding.NavNetworkNode);


}(window.JJ.BE.AI.Pathfinding = window.JJ.BE.AI.Pathfinding || {}));
}(window.JJ.BE.AI = window.JJ.BE.AI || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));