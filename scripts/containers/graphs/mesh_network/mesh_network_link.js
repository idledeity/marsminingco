(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(Containers, undefined) { /* Containers submodule namespace */

  // Stores the link information from one MeshNetworkNode to another MeshNetworkNode
  //
  Containers.MeshNetworkLink = class MeshNetworkLink {
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
      // Ensure the linkNode is either null or a valid Containers.MeshNetworkNode object
      if (!MMC.System.assert(((linkNode == null) || (linkNode instanceof Containers.MeshNetworkNode)), 
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


}(window.MMC.Containers = window.MMC.Containers || {}));
}(window.MMC = window.MMC || {}));