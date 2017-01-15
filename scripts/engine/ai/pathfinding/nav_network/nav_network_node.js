(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(AI, undefined) { /* AI submodule namespace */
(function(Pathfinding, undefined) { /* Behavior submodule namespace */

  // The NavNetworkNode class represents a node in the NavMeshNetwork.
  //
  Pathfinding.NavNetworkNode = class NavNetworkNode extends JJ.Containers.MeshNetworkNode {
    constructor(worldPos) {
      // Call the super
      super();

      // Store a copy of the world position
      this.worldPos = new JJ.Math.Vector3(worldPos);   // Position of the navigation node in world space
    }

    // Returns the world position of the navigation node
    getWorldPos() {
      return this.worldPos;
    }

    // Sets the world position of the navigation node
    setWorldPos(worldPos) {
      this.worldPos = worldPos;
    }

    //
    // Serializable methods
    //

    static getSerializationId() {
      return "NavNetworkNode";
    }

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