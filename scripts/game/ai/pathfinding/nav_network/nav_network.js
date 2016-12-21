(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(AI, undefined) { /* AI submodule namespace */
(function(Pathfinding, undefined) { /* Behavior submodule namespace */


  // The NavNetwork is a network of interconnected nodes representing world locations accessible by navigation.
  //
  // Each accessible locations contains a list of links to other nodes in the network, which can be used to navigate
  // through the entirety of the network.
  //
  Pathfinding.NavNetwork = class NavNetwork extends MMC.Containers.MeshNetwork {
    // Constructor
    constructor() {
      // Call the super
      super();
    }

    // Adds a node to the MeshNetwork
    //
    // node:    Must be an instance of MMC.AI.Pathfinding.MeshNetworkNode,
    //
    // returns: The node ID of teh inserted node, or Pathfinding.MeshNetworkNodeInvalidId if the insertion failed
    //
    addNode(node) {
      // Check the node type
      if (!MMC.System.assert((node instanceof Pathfinding.NavNetworkNode), "Invalid node type.")) {
        return Pathfinding.MeshNetworkNodeInvalidId;
      }

      return super.addNode(node);
    }

  }


}(window.MMC.AI.Pathfinding = window.MMC.AI.Pathfinding || {}));
}(window.MMC.AI = window.MMC.AI || {}));
}(window.MMC = window.MMC || {}));