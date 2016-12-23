(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(AI, undefined) { /* AI submodule namespace */
(function(Pathfinding, undefined) { /* Behavior submodule namespace */

  // The NavNetworkNode class represents a node in the NavMeshNetwork.
  //
  Pathfinding.NavNetworkNode = class NavNetworkNode extends MMC.Containers.MeshNetworkNode {
    constructor(worldPos) {
      // Call the super
      super();
      
      // Store a copy of the world position
      this.worldPos = new MMC.Math.Vector3(worldPos);   // Position of the navigation node in world space
    }

    // Returns the world position of the navigation node
    getWorldPos() {
      return this.worldPos;
    }

    // Sets the world position of the navigation node
    setWorldPos(worldPos) {
      this.worldPos = worldPos;
    }
  }


}(window.MMC.AI.Pathfinding = window.MMC.AI.Pathfinding || {}));
}(window.MMC.AI = window.MMC.AI || {}));
}(window.MMC = window.MMC || {}));