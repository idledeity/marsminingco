(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(AI, undefined) { /* AI submodule namespace */
(function(Pathfinding, undefined) { /* Behavior submodule namespace */

  // Stores the link information from one MeshNetworkNode to another MeshNetworkNode
  //
  Pathfinding.MeshNetworkLink = class MeshNetworkLink {
    constructor(linkNode, linkWeight) {
      this.setLinkNode(linkNode);
      this.setLinkWeight(linkWeight);
    }

    // Returns the node linked to
    getLinkNode() {
      return this.linkNode;
    }

    // Sets the node this link points to
    setLinkNode(linkNode) {
      // Ensure the linkNode is either null or a valid Pathfinding.MeshNetworkNode object
      if (!MMC.System.assert(((linkNode == null) || (linkNode instanceof Pathfinding.MeshNetworkNode)), 
        "LinkNode must be an instance of NavNetworkNode")) {
        return;
      }

      this.linkNode = linkNode;
    }

    // Returns the weight of the link
    getLinkWeight() {
      return this.linkWeight;
    }

    // Sets the weight of the link
    setLinkWeight(linkWeight) {
      this.linkWeight = linkWeight;
    }

  }


}(window.MMC.AI.Pathfinding = window.MMC.AI.Pathfinding || {}));
}(window.MMC.AI = window.MMC.AI || {}));
}(window.MMC = window.MMC || {}));