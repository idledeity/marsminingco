(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(AI, undefined) { /* AI submodule namespace */
(function(Pathfinding, undefined) { /* Behavior submodule namespace */

  // Constant for an invalid mesh network node id
  const MeshNetworkNodeInvalidId = -1;
  Pathfinding.MeshNetworkNodeInvalidId = MeshNetworkNodeInvalidId;

  // Simple incrementor to generate the next MeshNetworkNode ID
  let MeshNetworkNodeNextId = 0;

  // The MeshNetworkNode class represents a node in the MeshNetwork.
  //
  // Each node in the network can be linked to other nodes in the mesh network to form a directed graph.
  //
  Pathfinding.MeshNetworkNode = class MeshNetworkNode {
    constructor() {
      this.nodeId = MeshNetworkNodeNextId++;
      this.meshLinks = [];
    }

    // Returns the ID of this node
    getId() {
      return this.nodeId;
    }

    // Adds a link to this node
    addMeshLink(newMeshLink) {
      // Ensure the connection type is valid
      if (!MMC.System.assert((newMeshLink instanceof Pathfinding.MeshNetworkLink),
        "Links must be an instance of MeshNetworkLink")) {
        return false;
      }

      // Add it to the array of connections
      this.meshLinks.push(newMeshLink);
      return true;
    }

    // Returns the number of outgoing links this node has
    getMeshLinkCount() {
      return this.meshLinks.length;
    }

    // Returns the link at the specified index
    getMeshLink(index) {
      // Ensure the index is valid
      if (!MMC.System.assert(((index >= 0) && (index < this.meshLinks.length)), "Index outside of bounds.")) {
        return;
      }

      return this.meshLinks[index];
    }

    // Returns the MeshNetworkLink from this node to the specified nodeId if one exists, otherwise returns null 
    getLinkToNode(nodeId) {
      // Search all of the mesh links
      for (let linkIndex = 0; linkIndex < this.meshLinks.length; ++linkIndex) {
        let currentLink = this.getMeshLink(linkIndex);
        if (currentLink.getLinkNode().getId() == nodeId) {
          return currentLink;
        }
      }

      return null;
    }
  }


}(window.MMC.AI.Pathfinding = window.MMC.AI.Pathfinding || {}));
}(window.MMC.AI = window.MMC.AI || {}));
}(window.MMC = window.MMC || {}));